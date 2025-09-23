import type { LanguageCode } from '@oceanlex/models'
import Navbar from '@/components/Navbar'
import { LangProvider } from './LangContext'

export default async function LangLayout({ children, params }: {
	children: React.ReactNode
	params: Promise<{ lang: LanguageCode }>
}) {
	const { lang } = await params

	return (
		<LangProvider lang={lang}>
			<Navbar />
			<main className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8">{children}</main>
		</LangProvider>
	)
}
