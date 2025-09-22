// Node, files
import 'dotenv/config'
import fs from 'node:fs'
import readline from 'node:readline'

// Oceanlex DB
import { eq } from 'drizzle-orm'
import { db, schema } from '@oceanlex/db'
const { sentences, sentenceTexts } = schema

// Odyssee sentence model
type SentenceDoc = {
	_id: string,
	text: Record<string, string | null>,
	transcriptions?: Record<string, unknown>
}

async function* lines(file: string) {
	const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity })
	for await (const line of rl) if (line.trim()) yield line
}

async function upsertSentence(doc: SentenceDoc) {
	// header
	const existing = await db.query.sentences.findFirst({
		where: eq(sentences.firestoreId, doc._id),
		columns: { id: true }
	})

	let sentenceId: number
	if (!existing) {
		const [row] = await db
			.insert(sentences)
			.values({ firestoreId: doc._id })
			.returning({ id: sentences.id })
		sentenceId = row!.id
	} else {
		sentenceId = existing.id
	}

	// sentence texts (skip nulls)
	const texts = Object.entries(doc.text).filter(([, v]) => v)
		.map(([lang, text]) => ({ sentenceId, lang, text: text! }))

	if (texts.length) {
		await db
			.insert(sentenceTexts)
			.values(texts)
			.onConflictDoUpdate({
				target: [sentenceTexts.sentenceId, sentenceTexts.lang],
				set: { text: sentenceTexts.text }
			})
	}

	return sentenceId
}


async function main(file: string) {
	const BATCH_SIZE = 1000
	let n = 0

	for await (const line of lines(file)) {
		const doc = JSON.parse(line) as SentenceDoc
		await upsertSentence(doc)
		if (++n % BATCH_SIZE === 0) console.log(`sentences: ${n}`)
	}

	console.log(`✅ sentences imported: ${n}`)
}

const file = process.argv[2]
if (!file) {
	console.error('Usage: import-sentences <file.ndjson>')
	process.exit(1)
}
main(file).catch(e => { console.error(e); process.exit(1) })
