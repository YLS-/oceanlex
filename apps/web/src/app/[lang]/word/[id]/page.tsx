import { LanguageCode, Word } from '@oceanlex/models'
import WordDetails from '@/components/word/WordDetails'


export default async function WordPage({ params }: { params: Promise<{ lang: LanguageCode; id: string }> }) {
	const { lang, id } = await params

	const apiBase = process.env.NEXT_PUBLIC_API_URL!
	const res = await fetch(`${apiBase}/words?id=${id}`, { cache: 'no-store' })
	const entry: Word | { error: string } = await res.json()

	if ((entry as any).error) {
		return <div className="text-sm text-red-600">Not found.</div>
	}

	const e = entry as Word

	return (
		<WordDetails word={e} lang={lang} />
	)
}
