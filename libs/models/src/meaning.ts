import { MultilingualText } from './language'
import { Sentence } from './sentence'
import { LexicalClass } from './lexclasses'

export interface Meaning {
	translations: MultilingualText
	pos?: LexicalClass | null		// options PoS override

	sentences: Sentence[]
}
