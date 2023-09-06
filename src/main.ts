import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

/**
 * @description: NestJS with Fastify
 */
async function bootstrapFastify() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  const PORT = process.env.NESTAPP_PORT || 3000;
  await app.listen(PORT, '0.0.0.0');
}
bootstrapFastify();
