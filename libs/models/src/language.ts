// App-domain models (UI/API)
export type LanguageCode = 'fr' | 'en' | 'ja' | 'zh' | 'th' | 'id'

// Helper for multilingual text containers. Values may be null when missing.
export type MultilingualText = Partial<Record<LanguageCode, string | null>>
