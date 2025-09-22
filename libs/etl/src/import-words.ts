// Node, files
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import fg from 'fast-glob'

// Oceanlex DB
import { eq, and, inArray } from 'drizzle-orm'
import { db, schema } from '@oceanlex/db'
const { words, wordHeadwords, meanings, meaningTranslations, sentences, meaningSentences } = schema

// Odyssee word and meaning models
type MeaningDoc = {
	_id: string
	translations: Record<string, string | null>
	part_of_speech: string | null
	sentences: string[]
	}

type WordDoc = {
	_id: string
	language: string
	headwords: Record<string, string | null>
	phonetic?: string | null
	part_of_speech?: string | null
	lexeme_tags?: string | null
	meanings: MeaningDoc[]
}

// streaming helper
async function* lines(file: string) {
	const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity })
	for await (const line of rl) if (line.trim()) yield line
}

// cache sentence firestoreId→id to cut DB round-trips
const sentenceIdCache = new Map<string, number>()
async function ensureSentenceByFSId(firestoreId: string): Promise<number> {
	// already cached -> just return the sentence PG id
	if (sentenceIdCache.has(firestoreId)) return sentenceIdCache.get(firestoreId)!

	const row = await db.query.sentences.findFirst({
		where: eq(sentences.firestoreId, firestoreId),
		columns: { id: true }
	})

	// If sentences weren’t imported yet: minimal stub; you can backfill texts later
	if (!row) {
		throw new Error(`Sentence not found: ${firestoreId}`)
		// const [ins] = await db.insert(sentences).values({ firestoreId: firestoreId }).returning({ id: sentences.id })
		// sentenceIdCache.set(firestoreId, ins.id)
		// return ins.id
	}

	sentenceIdCache.set(firestoreId, row.id)
	return row.id
}

async function upsertWord(word: WordDoc) {
	// words.header (use firestoreId uniqueness)
	const existingWord = await db.query.words.findFirst({
		where: eq(words.firestoreId, word._id),
		columns: { id: true }
	})

	const base = {
		firestoreId: word._id,
		lang: word.language,
		phonetic: word.phonetic ?? null,
		pos: word.part_of_speech ?? null,
		lexeme_tags: word.lexeme_tags ?? null
	}

	let wordId: number
	if (!existingWord) {
		const [insertedId] = await db.insert(words).values(base).returning({ id: words.id })
		wordId = insertedId!.id
	} else {
		wordId = existingWord.id
		// optional: keep POS/tags updated
		await db
			.update(words)
			.set({ phonetic: base.phonetic, pos: base.pos, lexeme_tags: base.lexeme_tags })
			.where(eq(words.id, wordId))
	}

	// word_headwords (skip nulls)
	//! also filter out 'zh_cn'...
	const headwords = Object.entries(word.headwords).filter(([lang, text]) => !!text && (lang !== 'zh_cn'))
		.map(([lang, text]) => ({ wordId, lang, text: text! }))

	if (headwords.length) {
		await db
			.insert(wordHeadwords)
			.values(headwords)
			.onConflictDoUpdate({
				target: [wordHeadwords.wordId, wordHeadwords.lang],
				set: { text: wordHeadwords.text }
			})
	}

	// meanings + translations + links
	// strategy: fetch current meanings by (word_id), map by order; upsert to keep order stable
	const existingMeanings = await db.query.meanings.findMany({
		where: eq(meanings.wordId, wordId),
		columns: { id: true, order: true }
	})
	const orderedMeanings = new Map(existingMeanings.map(m => [m.order, m.id]))

	// upsert meanings in order
	const meaningIds: number[] = []
	for (const [i, meaning] of word.meanings.entries()) {
		let meaningId = orderedMeanings.get(i)

		// if meaning doesn’t exist, insert it
		if (!meaningId) {
			const [insertedMeaning] = await db
				.insert(meanings)
				.values({ wordId, order: i, pos: meaning.part_of_speech ?? null })
				.returning({ id: meanings.id })
			meaningId = insertedMeaning!.id
		}

		// if meaning exists, update it
		else {
			await db
				.update(meanings)
				.set({ pos: meaning.part_of_speech ?? null })
				.where(eq(meanings.id, meaningId))
		}
		meaningIds.push(meaningId)

		// translations (skip nulls)
		//! also filter out 'zh_cn'...
		const translations = Object.entries(meaning.translations).filter(([lang, text]) => !!text && (lang !== 'zh_cn'))
			.map(([lang, text]) => ({ meaningId: meaningId!, lang, text: text! }))

		if (translations.length) {
			await db
				.insert(meaningTranslations)
				.values(translations)
				.onConflictDoUpdate({
					target: [meaningTranslations.meaningId, meaningTranslations.lang],
					set: { text: meaningTranslations.text }
				})
		}

		// meaning ↔ sentences links (preserve order)
		if (meaning.sentences?.length) {
			const sentenceIds = await Promise.all(meaning.sentences.map(ensureSentenceByFSId))
			const sentencesLinks = sentenceIds.map((sid, j) => ({ meaningId: meaningId!, sentenceId: sid, order: j }))
			// insert links; on conflict do nothing (composite PK)
			await db
				.insert(meaningSentences)
				.values(sentencesLinks)
				.onConflictDoNothing()
		}
	}

	return wordId
}

function inferLanguageFromFilename(file: string): string | null {
	// dict_fr.ndjson → 'fr' ; dict_ja.ndjson → 'ja' ; etc.
	const base = path.basename(file).toLowerCase()
	const match = base.match(/^dict[_-](?<lang>[a-z]{2,8})\.ndjson$/)
	return match?.groups?.lang ?? null
}

async function importFile(file: string) {
	const langFromName = inferLanguageFromFilename(file)
	const BATCH_SIZE = 1000
	let n = 0, insertedLang = langFromName

	for await (const line of lines(file)) {
		const doc = JSON.parse(line) as WordDoc
		// sanity: prefer doc.language, but warn if mismatch with filename
		if (langFromName && doc.language !== langFromName) {
			console.warn(`! language mismatch: file=${langFromName} doc=${doc.language} id=${doc._id}`)
		}

		insertedLang = doc.language
		await upsertWord(doc)
		if (++n % BATCH_SIZE === 0) console.log(`${path.basename(file)}: ${n}`)
	}

	console.log(`✅ ${path.basename(file)} (${insertedLang}) imported: ${n}`)
}

async function main(globOrFiles: string[]) {
	const files = (await fg(globOrFiles, { onlyFiles: true })).sort()

	if (files.length === 0) {
		console.error('No files matched. Usage: import-words data/dict_*.ndjson')
		process.exit(1)
	}

	for (const f of files) await importFile(f)
	console.log('✅ all word files done')
}

const args = process.argv.slice(2)
if (args.length === 0) {
	console.error('Usage: import-words <fileOrGlob ...>')
	process.exit(1)
}
main(args).catch(e => { console.error(e); process.exit(1) })
