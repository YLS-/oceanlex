import { MultilingualText } from './language'
import { Sentence } from './sentence'

export interface Meaning {
	translations: MultilingualText
	pos?: string | null		// options PoS override

	sentences: Sentence[]
}
