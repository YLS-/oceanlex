// Nest
import { Controller, Get, Query } from '@nestjs/common'

// Words
import { WordsService } from './words.service'
import { GetWordDto } from './dto/get-word.dto'

// test with:
// curl -s "http://localhost:3333/words?id=f8lErjrEIXUfFy1GJQwt" | jq

@Controller('words')
export class WordsController {

	constructor(
		private wordsService: WordsService
	) {}

	@Get()
	public getWord(@Query() q: GetWordDto) {
		return this.wordsService.getWord(q)
	}
}
