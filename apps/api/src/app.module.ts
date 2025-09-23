// Nest
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

// Words
import { HeadwordsModule } from './headwords/headwords.module'
import { WordsModule } from './words/words.module'

@Module({
	imports: [WordsModule, HeadwordsModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
