// DB
import { db } from '../client'
import { and, asc, desc, eq, gte, inArray, lt } from 'drizzle-orm'
import { MeaningRow, meaningSentences$, meaningTranslations$, meanings$, wordHeadwords$, WordRow, words$, sentences$, sentenceTexts$, SentenceRow, MeaningSentenceRow } from '../schema'

// Oceanlex models
import type { LanguageCode, LexicalClass, Meaning, MultilingualText, Sentence, Word } from "@oceanlex/models"
import type { HeadwordSearchResult, HeadwordsSearchMode } from '@oceanlex/transport'


/**
 * Get word parameters
 * @param wordId - Word ID
 */
export interface GetWordParams {
	wordId: string
}

type _MeaningId = number
type _SentenceId = number


export async function getWord(params: GetWordParams): Promise<Word> {
	const { wordId } = params

	// get word row first
	const wordRow: WordRow = await _getWordBase(wordId)

	// get word multilingual headwords
	const headwords = await _getHeadwordsText(wordRow.id)

	// get associated meanings
	const meaningRows = await _getMeaningsBase(wordRow.id)

	// get meanings multilingual text
	const meaningIds: number[] = meaningRows.map(m => m.id)
	const meaningTranslationsMap = await _getMeaningsTranslations(meaningIds)

	// get sentences linked to any of the meanings
	// (only for the Firestore ID... the rest is all in the sentenceTexts table)
	const meaningSentenceRows = await _getMeaningSentences(meaningIds)
	const meaningSentenceLinksMap = _getMeaningSentencesLinks(meaningSentenceRows)

	// get sentences multilingual text
	const sentenceIds: number[] = meaningSentenceRows.map(s => s.sentences.id)
	const sentencesMap: Map<_SentenceId, Sentence> = await _getSentences(sentenceIds)

	const meanings: Meaning[] = _getMeanings(meaningRows, meaningSentenceLinksMap, sentencesMap, meaningTranslationsMap)

	const word: Word = {
		id: wordRow.firestoreId,
		lang: wordRow.lang as LanguageCode,

		headwords: headwords,
		phonetic: wordRow.phonetic,
		pos: wordRow.pos as LexicalClass,
		lexeme_tags: wordRow.lexeme_tags,

		meanings: meanings
	}

	// console.dir({ word }, { depth: null, colors: true })
	// console.dir({ wordRow, meaningRows }, { depth: null, colors: true })

	return word
}


async function _getWordBase(wordId: string): Promise<WordRow> {
	const [wordRow]: WordRow[] = await db.select()
		.from(words$)
		.where(eq(words$.firestoreId, wordId))
		.limit(1)

	if (!wordRow) throw new Error('Word not found')

	return wordRow
}


async function _getHeadwordsText(wordId: number): Promise<MultilingualText> {
	const headwordsRows = await db.select()
		.from(wordHeadwords$)
		.where(eq(wordHeadwords$.wordId, wordId))

	const headwords = headwordsRows.reduce((obj, hw) => {
		obj[hw.lang as LanguageCode] = hw.text
		return obj
	}, {} as MultilingualText)

	return headwords
}


async function _getMeaningsBase(wordId: number): Promise<MeaningRow[]> {
	const meaningsRows = await db.select()
		.from(meanings$)
		.where(eq(meanings$.wordId, wordId))
		.orderBy(asc(meanings$.order))

	return meaningsRows
}


async function _getMeaningsTranslations(meaningIds: number[]): Promise<Map<_MeaningId, MultilingualText>> {
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

	return meaningTranslationsMap
}


type _MeaningSentenceJoin = {
	meaning_sentences: MeaningSentenceRow
	sentences: SentenceRow
}

async function _getMeaningSentences(meaningIds: number[]): Promise<_MeaningSentenceJoin[]> {
	const sentenceRows = await db.select()
		.from(meaningSentences$)
		.innerJoin(sentences$, eq(meaningSentences$.sentenceId, sentences$.id))
		.where(inArray(meaningSentences$.meaningId, meaningIds))

	return sentenceRows
}


function _getMeaningSentencesLinks(meaningSentenceRows: _MeaningSentenceJoin[]): Map<_MeaningId, { sId: _SentenceId, order: number }[]> {
	const meaningSentenceLinksMap = meaningSentenceRows.reduce((map, s) => {
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
	return meaningSentenceLinksMap
}


async function _getSentences(sentenceIds: number[]): Promise<Map<_SentenceId, Sentence>> {
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
	return sentencesMap
}


function _getMeanings(
	meaningRows: MeaningRow[],
	meaningSentenceLinksMap: Map<_MeaningId, { sId: _SentenceId, order: number }[]>,
	sentencesMap: Map<_SentenceId, Sentence>,
	meaningTranslationsMap: Map<_MeaningId, MultilingualText>
): Meaning[] {
	const meanings = meaningRows.toSorted((a, b) => a.order - b.order).reduce((arr, m) => {
		const sentenceLinks = meaningSentenceLinksMap.get(m.id)!
		const sentences = sentenceLinks.toSorted((a, b) => a.order - b.order).map(s => sentencesMap.get(s.sId)!)

		const meaning: Meaning = {
			pos: m.pos as LexicalClass,
			translations: meaningTranslationsMap.get(m.id)!,
			sentences: sentences
		}
		arr.push(meaning)

		return arr
	}, [] as Meaning[])
	// console.dir(meanings, { depth: null, colors: true })

	return meanings
}
