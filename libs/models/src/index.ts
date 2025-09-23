// App-domain models (UI/API)
export type LanguageCode = 'fr' | 'en' | 'ja' | 'zh' | 'th' | 'id'

// Helper for multilingual text containers. Values may be null when missing.
export type MultilingualText = Partial<Record<LanguageCode, string | null>>


export interface HeadwordSuggestion {
	wordId: string			// Firestore ID
	lang: LanguageCode
	headwords: MultilingualText
}

export interface Word {
	id: string					// original Firestore ID
	lang: LanguageCode		// dictionary language of this entry

	headwords: MultilingualText
	phonetic: string | null
	pos: string | null
	lexeme_tags: string | null

	meanings: Meaning[]
}

export interface Meaning {
	translations: MultilingualText
	pos?: string | null		// options PoS override

	sentences: Sentence[]
}

export interface Sentence {
	id: string					// original Firestore ID

	text: MultilingualText
}
