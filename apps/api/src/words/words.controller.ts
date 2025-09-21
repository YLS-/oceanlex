// Nest
import { Controller, Get } from '@nestjs/common'

// Words
import { WordsService } from './words.service'

@Controller('words')
export class WordsController {

	constructor(
		private wordsService: WordsService
	) {}

	@Get()
	public list() {
		return this.wordsService.list()
	}
}
