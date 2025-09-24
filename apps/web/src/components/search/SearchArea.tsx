'use client'
import { useState } from 'react'

// Context
import { useLang } from '@/app/[lang]/LangContext'

// Transport
import type { LanguageCode } from '@oceanlex/models'

// Components
import { useHeadwordsSearch } from './useHeadwordsSearch'
import SearchResults from './SearchResults'
import SearchBox from './SearchBox'


export default function SearchArea() {
	const lang: LanguageCode = useLang()
	const [searchText, setSearchText] = useState('')	// raw query text
	const { results, status, error } = useHeadwordsSearch(lang, searchText)

	// UI state
	const showResults = (status === 'success') && (results && results.length > 0)

	// TODO: allow selection with arrow keys
	function onSubmit(e: React.FormEvent) {
		e.preventDefault()

		// const firstItem = items[0]
		// if (firstItem) router.push(`/${lang}/word/${firstItem.wordId}`)
	}

	return (
		<div className="relative mx-auto max-w-2xl">
			{/* search box */}
			<form onSubmit={ onSubmit }>
				<SearchBox value={searchText} onChange={setSearchText} />
			</form>

			{/* search results */}
			{showResults && results.length > 0 && (
				<SearchResults results={results} />
			)}

			{/* loading indicator */}
			{(status === 'loading') && <div className="absolute right-3 top-3 text-sm text-gray-500">…</div>}

			{/* error message */}
			{(status === 'error') && <div className="absolute right-3 top-3 text-sm text-red-500">{error as string}</div>}
		</div>
	)
}
