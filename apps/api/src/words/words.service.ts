// Nest
import { Injectable, NotFoundException } from '@nestjs/common'

// DB
import { asc, eq, inArray } from 'drizzle-orm'
import { db, words$, type WordRow, meanings$, type MeaningRow, sentences$, meaningSentences$, sentenceTexts$, meaningTranslations$, wordHeadwords$ } from '@oceanlex/db'

// DB
import { GetWordDto } from './dto/get-word.dto'
import type { Word, Meaning, Sentence, MultilingualText, LanguageCode, LexicalClass } from '@oceanlex/models'

type _MeaningId = number
type _SentenceId = number

@Injectable()
export class WordsService {

	public async getWord(dto: GetWordDto): Promise<Word> {
		const { id: wordId } = dto

		// get word row first
		const [wordRow]: WordRow[] = await db.select()
			.from(words$)
			.where(eq(words$.firestoreId, wordId))
			.limit(1)

		if (!wordRow) {
			throw new NotFoundException('Word not found')
		}

		// get word multilingual headwords
		const headwordsRows = await db.select()
			.from(wordHeadwords$)
			.where(eq(wordHeadwords$.wordId, wordRow.id))

		const headwords = headwordsRows.reduce((obj, hw) => {
			obj[hw.lang as LanguageCode] = hw.text
			return obj
		}, {} as MultilingualText)

		// get associated meanings
		const meaningRows: MeaningRow[] = await db.select()
			.from(meanings$)
			.where(eq(meanings$.wordId, wordRow.id))
			.orderBy(asc(meanings$.order))

		// get meanings multilingual text
		const meaningIds: number[] = meaningRows.map(m => m.id)
		const meaningTranslationsRows = await db.select()
			.from(meaningTranslations$)
			.leftJoin(meanings$, eq(meaningTranslations$.meaningId, meanings$.id))
			.where(inArray(meanings$.id, meaningIds))

		const meaningTranslationsMap = meaningTranslationsRows.reduce((map, tr) => {
			if (!tr.meaning_translations) return map

			if (map.has(tr.meaning_translations.meaningId)) {
				const current = map.get(tr.meaning_translations.meaningId)!
				current[tr.meaning_translations.lang as LanguageCode] = tr.meaning_translations.text
				map.set(tr.meaning_translations.meaningId, current)
			} else {
				map.set(tr.meaning_translations.meaningId, { [tr.meaning_translations.lang as LanguageCode]: tr.meaning_translations.text })
			}

			return map
		}, new Map<_MeaningId, MultilingualText>())

		// get sentences linked to any of the meanings
		// (only for the Firestore ID... the rest is all in the sentenceTexts table)
		const sentenceRows = await db.select()
			.from(meaningSentences$)
			.innerJoin(sentences$, eq(meaningSentences$.sentenceId, sentences$.id))
			.where(inArray(meaningSentences$.meaningId, meaningIds))

		const meaningSentenceLinksMap = sentenceRows.reduce((map, s) => {
			if (!s.meaning_sentences || !s.sentences) return map

			if (map.has(s.meaning_sentences.meaningId)) {
				const current = map.get(s.meaning_sentences.meaningId)!
				current.push({ sId: s.meaning_sentences.sentenceId, order: s.meaning_sentences.order })
				map.set(s.meaning_sentences.meaningId, current)
			} else {
				map.set(s.meaning_sentences.meaningId, [{ sId: s.meaning_sentences.sentenceId, order: s.meaning_sentences.order }])
			}

			return map
		}, new Map<_MeaningId, { sId: _SentenceId, order: number }[]>())
		// console.dir({ meaningSentenceLinksMap }, { depth: null, colors: true })

		// get sentences multilingual text
		const sentenceIds: number[] = sentenceRows.map(s => s.sentences.id)
		const sentenceTextsRows = await db.select()
			.from(sentenceTexts$)
			.leftJoin(sentences$, eq(sentenceTexts$.sentenceId, sentences$.id))
			.where(inArray(sentences$.id, sentenceIds))
		// console.dir({ sentenceTextsRows }, { depth: null, colors: true })

		const sentencesMap = sentenceTextsRows.reduce((map, s) => {
			if (!s.sentences) return map

			if (map.has(s.sentences.id)) {
				const current = map.get(s.sentences.id)!.text
				const mergedTexts = { ...current, [s.sentence_texts.lang]: s.sentence_texts.text }
				map.set(s.sentences.id, { id: s.sentences.firestoreId, text: mergedTexts })
			} else {
				map.set(s.sentences.id, { id: s.sentences.firestoreId, text: { [s.sentence_texts.lang]: s.sentence_texts.text } })
			}

			return map
		}, new Map<_SentenceId, Sentence>())
		// console.dir({ sentencesMap }, { depth: null, colors: true })

		const meanings = meaningRows.toSorted((a, b) => a.order - b.order).reduce((arr, m) => {
			const sentenceLinks = meaningSentenceLinksMap.get(m.id)!
			const sentences = sentenceLinks.toSorted((a, b) => a.order - b.order).map(s => sentencesMap.get(s.sId)!)

			const meaning: Meaning = {
				pos: m.pos as LexicalClass,
				translations: meaningTranslationsMap.get(m.id)!,
				sentences: sentences
			}
			arr.push({ meaning, order: m.order })

			return arr
		}, [] as { meaning: Meaning, order: number }[])
		// console.dir(meanings, { depth: null, colors: true })

		const word: Word = {
			id: wordRow.firestoreId,
			lang: wordRow.lang as LanguageCode,

			headwords: headwords,
			phonetic: wordRow.phonetic,
			pos: wordRow.pos as LexicalClass,
			lexeme_tags: wordRow.lexeme_tags,

			meanings: meanings.toSorted((a, b) => a.order - b.order).map(m => m.meaning)
		}

		// console.dir({ word }, { depth: null, colors: true })
		// console.dir({ wordRow, meaningRows }, { depth: null, colors: true })
		return word
	}

}
