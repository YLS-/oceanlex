// Nest
import { Controller, Get, Query } from '@nestjs/common'

// Headwords module
import { HeadwordsService } from './headwords.service'
import { GetHeadwordsDto } from './dto/get-headwords.dto'

@Controller('headwords')
export class HeadwordsController {

	constructor(
		private headwordsService: HeadwordsService
	) {}

	@Get()
	public search(@Query() q: GetHeadwordsDto) {
		return this.headwordsService.search(q)
	}
}
