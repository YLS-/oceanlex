// Nest
import { Injectable } from '@nestjs/common'

// DB
import { db, wordHeadwords, words } from '@oceanlex/db'
import { and, asc, eq, gte, inArray } from 'drizzle-orm'

// Headwords
import type { HeadwordSuggestion } from '@oceanlex/models'
import { GetHeadwordsDto } from './dto/get-headwords.dto'

@Injectable()
export class HeadwordsService {

	public async search(q: GetHeadwordsDto): Promise<HeadwordSuggestion[]> {
		const { query: prefix, lang: targetLang, limit } = q
		// TODO: consider whether to handle "around prefix" search mode or not
		// const beforeCount = Math.floor(total / 2)
		// const afterCount = total - beforeCount
		const afterCount = limit

		const afterRows = await db.select({
			_wordId: words.id,
			firestoreId: words.firestoreId,
			pos: words.pos,
			headwords: wordHeadwords.text
		})
		// join words and headwords tables
		.from(wordHeadwords)
		.innerJoin(words, eq(words.id, wordHeadwords.wordId))
		// filter by language and prefix
		.where(and(
			eq(words.lang, targetLang),
			gte(wordHeadwords.text, prefix)
		))
		.orderBy(asc(wordHeadwords.text))
		.limit(afterCount)

		// additional query to merge English headwords, keeping lexicographical order of target language
		const orderedIds = afterRows.map(row => row._wordId)
		const enHeadwordsRows = await db.select({
			_wordId: wordHeadwords.wordId,
			text_en: wordHeadwords.text
		})
		.from(wordHeadwords)
		.where(and(
			eq(wordHeadwords.lang, 'en'),
			inArray(wordHeadwords.wordId, orderedIds)
		))

		const enHeadwordsMap = new Map<number, string>()
		for (const row of enHeadwordsRows) {
			enHeadwordsMap.set(row._wordId, row.text_en)
		}

		// merge results
		const results: HeadwordSuggestion[] = afterRows.map(wordRow => ({
			wordId: wordRow.firestoreId,
			lang: targetLang,
			pos: wordRow.pos,
			headwords: {
				[targetLang]: wordRow.headwords,
				en: enHeadwordsMap.get(wordRow._wordId) ?? null
			}
		}))

		return results
	}

}
