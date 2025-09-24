// React
import { useMemo } from 'react'
import { useDebounced } from '../../libs/hooks/useDebounce'
import { useQueryLite } from '../../libs/hooks/useQueryLite'

// Oceanlex
import type { LanguageCode } from '@oceanlex/models'
import type { HeadwordsSearchQuery } from '@oceanlex/transport'
import { fetchHeadwords } from '../../libs/api/fetch-headwords'

// trim whitespace and replace multiple spaces with a single space
const trimmer = (s: string) => s.trim().replace(/\s+/g, ' ')


export function useHeadwordsSearch(lang: LanguageCode, searchText: string, limit = 10) {
	const debouncedSearchText = useDebounced(searchText, { delay: 200, toKey: trimmer })

	const args = useMemo(() => {
		// disable query when empty
		if (!debouncedSearchText) return null

		const q: HeadwordsSearchQuery = { sl: lang, tl: 'en', query: debouncedSearchText, mode: 'around', limit }
		return q
	 }, [lang, debouncedSearchText, limit])

	const { data: results, status, error, abort } = useQueryLite(args, fetchHeadwords)
	return { results, status, error, abort }
}
