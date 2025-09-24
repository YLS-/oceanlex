import { z } from 'zod'
import type { LanguageCode, LexicalClass, MultilingualText } from '@oceanlex/models'

// Request (query) schema + type
export const HEADWORDS_SEARCH_MODES = ['around', 'after'] as const
export type HeadwordsSearchMode = (typeof HEADWORDS_SEARCH_MODES)[number]

export const HeadwordsQuerySchema = z.object({
	sl: z.custom<LanguageCode>((v) => typeof v === 'string') as z.ZodType<LanguageCode>,
	tl: z.custom<LanguageCode>((v) => typeof v === 'string') as z.ZodType<LanguageCode>,
	query: z.string().min(1),
	mode: z.enum(HEADWORDS_SEARCH_MODES).optional().default('around'),
	limit: z.coerce.number().int().min(2).max(50).optional().default(10),
})
export type HeadwordsSearchQuery = z.infer<typeof HeadwordsQuerySchema>


// Response type
export interface HeadwordSearchResult {
	wordId: string			// Firestore ID
	lang: LanguageCode
	pos: LexicalClass | null

	headwords: MultilingualText
}

export type HeadwordsResponse = HeadwordSearchResult[]

// serialization helper (usable in Next + tests)
export const toQueryString = (q: HeadwordsSearchQuery) =>
	new URLSearchParams({
		sl: q.sl,
		tl: q.tl,
		query: q.query,
		mode: q.mode ?? 'around',
		limit: String(q.limit ?? 10),
	}).toString()
