'use client'
import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'
import { useLang } from '@/app/[lang]/LangContext'
import { LanguageCode } from '@models/index'


export default function Navbar() {
	const lang: LanguageCode = useLang()

	return (
		<header className="sticky top-0 z-50 border-b bg-white/20 backdrop-blur">
			<div className="mx-auto flex max-w-4xl items-center justify-between p-3">
				<Link
					href={`/${lang}`}
					className="font-semibold tracking-tight">
					OceanLex
				</Link>

				<LanguageSwitcher />
			</div>
		</header>
	)
}
