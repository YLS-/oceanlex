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

	app.enableCors({
		origin: process.env.CORS_ORIGIN,
		methods: ['GET', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: false,		// true only if actually sending cookies/auth
	})

	await app.listen(process.env.PORT ?? 3333)
}

bootstrap()
