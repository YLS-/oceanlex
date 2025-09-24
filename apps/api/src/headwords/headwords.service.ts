// Nest
import { Injectable } from '@nestjs/common'

// Headwords
import { GetHeadwordsDto } from './dto/get-headwords.dto'
import { searchHeadwords, type SearchHeadwordsParams } from '@oceanlex/db'
import type { HeadwordSearchResult } from '@oceanlex/transport'


@Injectable()
export class HeadwordsService {

	public async search(q: GetHeadwordsDto): Promise<HeadwordSearchResult[]> {
		const { query: prefix, sl, tl, mode, limit } = q

		const params: SearchHeadwordsParams = {
			sourceLang: sl,
			targetLang: tl,
			prefix,
			mode,
			limit
		}

		const headwords = await searchHeadwords(params)
		return headwords
	}

}
