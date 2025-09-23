'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/app/[lang]/LangContext'
import { LanguageCode, HeadwordSuggestion } from '@models/index'


export default function SearchBox() {
	const [query, setQuery] = useState('')
	const [items, setItems] = useState<HeadwordSuggestion[]>([])
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const lang: LanguageCode = useLang()
	const abortRef = useRef<AbortController | null>(null)

	const apiBase = process.env.NEXT_PUBLIC_API_URL!

	useEffect(() => {
		if (!query) { setItems([]); setOpen(false); return }
		setLoading(true)
		abortRef.current?.abort()

		const ctrl = new AbortController()
		abortRef.current = ctrl

		const t = setTimeout(async () => {
			try {
				const url = `${apiBase}/words/headwords?lang=${lang}&q=${encodeURIComponent(query)}&limit=10`
				const res = await fetch(url, { signal: ctrl.signal })
				const data: HeadwordSuggestion[] = await res.json()
				setItems(data)
				setOpen(true)
			} catch (e) {
				if ((e as any).name !== 'AbortError') console.error(e)
			} finally { setLoading(false) }
		}, 150)

		return () => { clearTimeout(t); ctrl.abort() }
	}, [query, lang])

	function onSubmit(e: React.FormEvent) {
		e.preventDefault()

		const firstItem = items[0]
		if (firstItem) router.push(`/${lang}/word/${firstItem.wordId}`)
	}

	return (
		<div className="relative mx-auto max-w-2xl">
			<form onSubmit={ onSubmit }>
				<input
					autoFocus
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Type a headword…"
					className="w-full rounded-2xl border px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
				/>
			</form>

			{open && items.length > 0 && (
				<ul className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border bg-white shadow">
					{items.map(s => (
						<li key={s.wordId}>
							<button
								className="block w-full px-4 py-2 text-left hover:bg-gray-50"
								onClick={ () => router.push(`/${lang}/word/${s.wordId}`)}
							>
								{s.headwords[lang]}
							</button>
						</li>
					))}
				</ul>
			)}

			{loading && <div className="absolute right-3 top-3 text-sm text-gray-500">…</div>}
		</div>
	)
}
