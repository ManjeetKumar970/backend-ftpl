import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000; // Default to 3000 if not set

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Use Morgan middleware
  app.use(morgan('dev'));

  // Set API global prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS for localhost:3000
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
