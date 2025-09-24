// App-domain models (UI/API)
export const LANGUAGE_CODES = ['fr', 'en', 'ja', 'zh', 'th', 'id'] as const
export type LanguageCode = typeof LANGUAGE_CODES[number]

export const isLanguageCode = (s: string): s is LanguageCode =>
	(LANGUAGE_CODES as readonly string[]).includes(s)

// Helper for multilingual text containers. Values may be null when missing.
export type MultilingualText = Partial<Record<LanguageCode, string | null>>
