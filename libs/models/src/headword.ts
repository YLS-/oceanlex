import type { LanguageCode, MultilingualText } from './language'
import type { LexicalClass } from './lexclasses'

export interface HeadwordSuggestion {
	wordId: string			// Firestore ID
	lang: LanguageCode
	pos: LexicalClass | null

	headwords: MultilingualText
}
