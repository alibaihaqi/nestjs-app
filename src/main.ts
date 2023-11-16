import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

/**
 * @description: NestJS with Fastify
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      // Whitelist is used to filter the request body property that sent to the server but we don't define
      whitelist: true,
    }),
  );

  const PORT = process.env.NESTAPP_PORT || 3000;
  await app.listen(PORT, '0.0.0.0');
}

bootstrap();
