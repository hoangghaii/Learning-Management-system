import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({ origin: process.env.ORIGIN || 'http://localhost:3000' });

  app.setGlobalPrefix('/api/v1');

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT || 8001);
}

bootstrap();
