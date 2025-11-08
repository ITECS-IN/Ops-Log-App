import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Shift Log API')
    .setDescription('API documentation for the Shift Log backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.enableCors({
    origin: 'http://localhost:3000',
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
}
void bootstrap();
