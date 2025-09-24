import type { LanguageCode, MultilingualText } from './language'
import { LexicalClass } from './lexclasses'
import type { Meaning } from './meaning'

export interface Word {
	id: string					// original Firestore ID
	lang: LanguageCode		// dictionary language of this entry

	headwords: MultilingualText
	phonetic: string | null
	pos: LexicalClass | null
	lexeme_tags: string | null

	meanings: Meaning[]
}
