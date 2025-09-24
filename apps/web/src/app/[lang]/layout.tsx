// Next
import { notFound } from 'next/navigation'

// Oceanlex models
import { isLanguageCode } from '@oceanlex/models'
import Navbar from '@/components/navigation/Navbar'
import { LangProvider } from './LangContext'


export default async function LangLayout({ children, params }: {
	children: React.ReactNode
	params: Promise<{ lang: string }>
}) {
	// server-side params
	const { lang } = await params
	if (!isLanguageCode(lang)) return notFound()

	return (
		<LangProvider lang={lang}>
			<Navbar />
			<main className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8">{children}</main>
		</LangProvider>
	)
}
