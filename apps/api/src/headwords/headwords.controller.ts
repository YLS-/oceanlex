// Nest
import { Controller, Get, Query } from '@nestjs/common'

// Headwords
import { HeadwordsService } from './headwords.service'
import { GetHeadwordsDto } from './dto/get-headwords.dto'

// test with:
// curl -s "http://localhost:3333/headwords?lang=fr&query=ma&limit=4" | jq

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
