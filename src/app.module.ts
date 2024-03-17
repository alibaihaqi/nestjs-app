import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { LoggerMiddleware } from './middleware/logger.middleware';
import { ApiipModule } from './apiip/apiip.module';
import { AwsModule } from './aws/aws.module';
import { CommonModule } from './common/common.module';
import { GeminiModule } from './gemini/gemini.module';
import { MathModule } from './math/math.module';
import { OpenaiModule } from './openai/openai.module';
import { PrismaModule } from './prisma/prisma.module';
import { RtcModule } from './rtc/rtc.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ApiipModule,
    AwsModule,
    CommonModule,
    GeminiModule,
    MathModule,
    OpenaiModule,
    PrismaModule,
    RtcModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        'aws/(.*)',
        'common/(.*)',
        'gemini/(.*)',
        'openai/(.*)',
        'rtc/(.*)',
      );
  }
}
