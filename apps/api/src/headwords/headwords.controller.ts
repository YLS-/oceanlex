// Nest
import { Controller, Get } from '@nestjs/common'

// Words
import { HeadwordsService } from './headwords.service'
import { LanguageCode } from '@oceanlex/models'

@Controller('headwords')
export class HeadwordsController {

	constructor(
		private headwordsService: HeadwordsService
	) {}

	@Get()
	public search() {
		const testQuery = {
			prefix: 'cam',
			targetLang: 'fr' as LanguageCode,
			total: 10
		}

		return this.headwordsService.search(testQuery.prefix, testQuery.targetLang, testQuery.total)
	}
}
