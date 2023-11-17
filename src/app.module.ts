import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './aws/aws.module';
import { CommonModule } from './common/common.module';
import { MathModule } from './math/math.module';
import { OpenaiModule } from './openai/openai.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AwsModule,
    CommonModule,
    MathModule,
    OpenaiModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('common', 'openai/(.*)');
  }
}
