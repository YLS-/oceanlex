// App-domain models (UI/API)
export const LANGUAGE_CODES = ['fr', 'en', 'ja', 'zh', 'th', 'id'] as const
export type LanguageCode = typeof LANGUAGE_CODES[number]

// Helper for multilingual text containers. Values may be null when missing.
export type MultilingualText = Partial<Record<LanguageCode, string | null>>
