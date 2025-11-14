import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
dotenv.config({ path: join(__dirname, '..', '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Log every request path
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Incoming request:', req.method, req.url);
    next();
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Shift Log API')
    .setDescription('API documentation for the Shift Log backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.enableCors({
    origin: [
      'https://ops-log.com',
      'https://www.ops-log.com',
      'http://localhost:3000', // keep for local dev
      'http://192.168.1.6:3000',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown fields
      forbidNonWhitelisted: true, // throw error for extra fields
      transform: true, // convert plain objects to DTO instances
    }),
  );

  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 4000);
  console.log(`🚀 Server running on port ${process.env.PORT ?? 4000}`);
}
void bootstrap();
