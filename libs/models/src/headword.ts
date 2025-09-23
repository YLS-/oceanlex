import type { LanguageCode, MultilingualText } from './language'

export interface HeadwordSuggestion {
	wordId: string			// Firestore ID
	lang: LanguageCode
	pos: string | null

	headwords: MultilingualText
}
