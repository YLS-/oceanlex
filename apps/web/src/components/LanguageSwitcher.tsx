'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useLang } from '@/app/[lang]/LangContext'
import { LanguageCode } from '@oceanlex/models'

const langs = [
	{ code: 'fr', label: 'Français' },
	{ code: 'ja', label: '日本語' },
	{ code: 'zh', label: '中文' },
	{ code: 'id', label: 'Bahasa' },
] as const

export default function LanguageSwitcher() {
	const router = useRouter()
	const path = usePathname()			// e.g., /fr/word/123
	const lang: LanguageCode = useLang()

	function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const selectedLang = e.target.value as LanguageCode

		// set cookie
		document.cookie = `ol_lang=${selectedLang}; Path=/; Max-Age=${60*60*24*365}`

		// swap first segment in URL
		const rest = path.split('/').slice(2).join('/')
		const newPath = `/${selectedLang}/${rest}`
		router.push(newPath)
	}

	return (
		<select
			value={lang}
			onChange={onChange}
			className="rounded-xl border px-3 py-1.5 text-sm shadow-sm focus:outline-none"
		>
			{ langs.map(l => (
				<option key={l.code} value={l.code}>{l.label}</option>
			)) }
		</select>
	)
}
