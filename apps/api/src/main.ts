import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'


async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const validation = new ValidationPipe({
		transform: true,					// use class-transformer to coerce query params types
		whitelist: true,					// strips unknown query params
		// forbidNonWhitelisted: true,	// throw an error if unknown properties are present
	})

	app.useGlobalPipes(validation)

	await app.listen(process.env.PORT ?? 3333)
}

bootstrap()
