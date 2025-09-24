'use client'
import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/app/[lang]/LangContext'

// Language models
import type { LanguageCode } from '@oceanlex/models'
import { HeadwordsQuerySchema, toQueryString, type HeadwordSearchResult, type HeadwordsSearchQuery } from '@oceanlex/transport'
import SearchResults from './SearchResults'


export default function SearchBox() {
	const [searchQuery, setSearchQuery] = useState('')
	const [items, setItems] = useState<HeadwordSearchResult[]>([])
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const lang: LanguageCode = useLang()
	const abortRef = useRef<AbortController | null>(null)

	const apiBase = process.env.NEXT_PUBLIC_API_URL!

	useEffect(() => {
		if (!searchQuery) { setItems([]); setOpen(false); return }
		setLoading(true)
		abortRef.current?.abort()

		const ctrl = new AbortController()
		abortRef.current = ctrl

		const t = setTimeout(async () => {
			try {
				const request: HeadwordsSearchQuery = {
					sl: lang,
					tl: 'en',
					query: searchQuery,
					mode: 'around',
					limit: 10
				}
				const parsed = HeadwordsQuerySchema.parse(request)
				const params = toQueryString(parsed)
				const url = `${apiBase}/headwords?${params}`
				
				const res = await fetch(url, { signal: ctrl.signal })
				const results: HeadwordSearchResult[] = await res.json()
				console.log(results)
				setItems(results)
				setOpen(true)
			} catch (e) {
				if ((e as any).name !== 'AbortError') console.error(e)
			} finally { setLoading(false) }
		}, 150)

		return () => { clearTimeout(t); ctrl.abort() }
	}, [searchQuery, lang])

	// TODO: allow selection with arrow keys
	function onSubmit(e: React.FormEvent) {
		e.preventDefault()

		// const firstItem = items[0]
		// if (firstItem) router.push(`/${lang}/word/${firstItem.wordId}`)
	}

	return (
		<div className="relative mx-auto max-w-2xl">
			<form onSubmit={ onSubmit }>
				<input
					autoFocus
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Type a headword…"
					className="w-full rounded-2xl border px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
				/>
			</form>

			{open && items.length > 0 && (
				<SearchResults results={items} />
			)}

			{loading && <div className="absolute right-3 top-3 text-sm text-gray-500">…</div>}
		</div>
	)
}
