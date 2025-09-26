// Nest
import { Injectable } from '@nestjs/common'

// Words
import { GetWordDto } from './dto/get-word.dto'
import { getWord } from '@oceanlex/db'
import type { Word } from '@oceanlex/models'


@Injectable()
export class WordsService {

	public async getWord(dto: GetWordDto): Promise<Word> {
		const { id: wordId } = dto

		const word = await getWord({ wordId })
		return word
	}

}
