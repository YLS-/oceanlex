// Nest
import { Module } from '@nestjs/common'

// Words
import { HeadwordsController } from './headwords.controller'
import { HeadwordsService } from './headwords.service'

@Module({
	controllers: [HeadwordsController],
	providers: [HeadwordsService],
	exports: [HeadwordsService],
})
export class HeadwordsModule {}
