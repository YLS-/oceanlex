// DB
import { db } from '../client'
import { wordHeadwords$, words$ } from '../schema'
import { and, asc, desc, eq, gte, inArray, lt } from 'drizzle-orm'

// Oceanlex models
import { LanguageCode, LexicalClass } from "@oceanlex/models"
import { HeadwordSearchResult, HeadwordsSearchMode } from '@oceanlex/transport'


/**
 * Search headwords parameters
 * @param sourceLang - Source language of the query headword
 * @param targetLang - Target language of the headwords to return
 * @param prefix - Headword text prefix to query against
 * @param mode - Lexicographic search mode (after or around query text)
 * @param limit - Maximum number of headwords to return
 */
export interface SearchHeadwordsParams {
	sourceLang: LanguageCode
	targetLang: LanguageCode
	prefix: string
	mode: HeadwordsSearchMode
	limit: number
}


/**
 * Search for headwords for a given source language, target language, prefix, mode and limit
 * @param params - The search parameters
 * @returns The list of headwords
 */
export async function searchHeadwords(params: SearchHeadwordsParams): Promise<HeadwordSearchResult[]> {
	const { sourceLang, targetLang, prefix, mode, limit } = params

	const beforeCount = (mode === 'around') ? Math.floor(limit / 2) : 0
	const afterCount = limit - beforeCount

	const beforeRows = await _getNearbyHeadwords(sourceLang, prefix, 'before', beforeCount)
	const afterRows = await _getNearbyHeadwords(sourceLang, prefix, 'after', afterCount)
	const wordRows = [...beforeRows.reverse(), ...afterRows]

	// additional query to merge English headwords, keeping lexicographical order of target language
	const wordIds = wordRows.map(row => row._wordId)
	const targetHeadwordsRows = await _getHeadwordsText(wordIds, targetLang)

	const targetHeadwordsMap = new Map<number, string>()
	for (const row of targetHeadwordsRows) {
		targetHeadwordsMap.set(row._wordId, row.text_target)
	}

	// merge results
	const results: HeadwordSearchResult[] = wordRows.map(wordRow => ({
		wordId: wordRow.firestoreId,
		lang: sourceLang,
		pos: wordRow.pos as LexicalClass,
		headwords: {
			[sourceLang]: wordRow.headwords,
			[targetLang]: targetHeadwordsMap.get(wordRow._wordId)!
		}
	}))

	return results
}


/**
 * Get the nearby headwords for a given source language, prefix, direction and count
 * @param sourceLang - The source language
 * @param prefix - The prefix
 * @param direction - The direction
 * @param count - The count
 * @returns The list of nearby headwords
 */
async function _getNearbyHeadwords(sourceLang: LanguageCode, prefix: string, direction: 'before' | 'after', count: number) {
	if (count === 0) return []

	const directionCondition = (direction === 'before') ? lt : gte
	const orderOperator = (direction === 'before') ? desc : asc

	const rows = await db.select({
		_wordId: words$.id,
		firestoreId: words$.firestoreId,
		pos: words$.pos,
		headwords: wordHeadwords$.text
	})
	// join words and headwords tables
	.from(wordHeadwords$)
	.innerJoin(words$, eq(words$.id, wordHeadwords$.wordId))
	// filter by language and prefix
	.where(and(
		// need to restrict headwords to target language;
		// constraining only on words.lang can allow headwords in other languages with same prefix
		eq(wordHeadwords$.lang, sourceLang),
		directionCondition(wordHeadwords$.text, prefix)
	))
	.orderBy(orderOperator(wordHeadwords$.text))
	.limit(count)

	return rows
}


/**
 * Get the text of the headwords for a given list of word ids and target language
 * @param wordIds - The list of word ids
 * @param targetLang - The target language
 * @returns The list of headwords text
 */
async function _getHeadwordsText(wordIds: number[], targetLang: LanguageCode) {
	const rows = await db.select({
		_wordId: wordHeadwords$.wordId,
		text_target: wordHeadwords$.text
	})
	.from(wordHeadwords$)
	.where(and(
		eq(wordHeadwords$.lang, targetLang),
		inArray(wordHeadwords$.wordId, wordIds)
	))

	return rows
}
