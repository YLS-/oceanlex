import { MultilingualText } from './language'

export interface Sentence {
	id: string					// original Firestore ID

	text: MultilingualText
}
