import { LanguageCode, Word } from '@models/index'

export default async function WordPage({ params }: { params: Promise<{ lang: LanguageCode; id: string }> }) {
	const { lang, id } = await params

	const apiBase = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
	const res = await fetch(`${apiBase}/words/${id}`, { cache: 'no-store' })
	const entry: Word | { error: string } = await res.json()

	if ((entry as any).error) {
		return <div className="text-sm text-red-600">Not found.</div>
	}

	const e = entry as Word
	const headword = e.headwords[lang] ?? ''

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight">{headword}</h1>
				<p className="text-sm text-gray-600">Language: {lang}</p>
			</div>

			<section>
				<h2 className="mb-2 text-lg font-medium">Meanings</h2>
				<ol className="space-y-2">
					{ e.meanings.map((m, i) => (
						<li key={m.translations[lang]} className="rounded-xl border p-3">
							<div className="font-medium">{i + 1}. {m.translations[lang]}</div>
							{m.pos && <div className="text-xs text-gray-500">{m.pos}</div>}
						</li>
					)) }
				</ol>
			</section>

			{/* <section>
				<h2 className="mb-2 text-lg font-medium">Example sentences</h2>
				{e.sentences.length === 0 ? (
					<div className="text-sm text-gray-600">No sentences yet.</div>
				) : (
					<ul className="space-y-2">
						{e.sentences.map((s) => (
							<li key={s.id} className="rounded-xl border p-3">
								<div className="">{s.text}</div>
								{s.translation && <div className="text-sm text-gray-600">{s.translation}</div>}
								{s.source && <div className="text-xs text-gray-400">{s.source}</div>}
							</li>
						))}
					</ul>
				)}
			</section> */}
		</div>
	)
}
