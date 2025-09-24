// Nest
import { Controller, Get, Query } from '@nestjs/common'

// Headwords
import { HeadwordsService } from './headwords.service'
import { GetHeadwordsDto } from './dto/get-headwords.dto'

// test with:
// curl -s "http://localhost:3333/headwords?sl=fr&tl=en&query=rue&limit=5&mode=around" | jq

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
