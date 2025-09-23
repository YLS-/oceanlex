'use client'
import { createContext, useContext } from 'react'
import { LanguageCode } from '@oceanlex/models'

const LangContext = createContext<LanguageCode>('fr')
export const useLang = () => useContext(LangContext)

export function LangProvider({ lang, children }: { lang: LanguageCode; children: React.ReactNode }) {
	return (
		<LangContext.Provider value={lang}>
			{children}
		</LangContext.Provider>
	)
}
