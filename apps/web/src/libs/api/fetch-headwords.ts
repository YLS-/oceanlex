import type { Fetcher } from '../hooks/useQueryLite'
import { HeadwordsQuerySchema, toQueryString, type HeadwordsSearchQuery, type HeadwordSearchResult } from '@oceanlex/transport'

const API_BASE = process.env.NEXT_PUBLIC_API_URL!

export const fetchHeadwords: Fetcher<HeadwordsSearchQuery, HeadwordSearchResult[]> = async (query: HeadwordsSearchQuery, signal: AbortSignal) => {
	const parsed = HeadwordsQuerySchema.parse(query)		// runtime validation
	const params = toQueryString(parsed)
	const url = `${API_BASE}/headwords?${params}`

	const response = await fetch(url, { signal })
	if (!response.ok) throw new Error(`HTTP ${response.status}`)

	const results: HeadwordSearchResult[] = await response.json()
	return results
}
