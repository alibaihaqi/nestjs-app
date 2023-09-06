import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MathController } from './math.controller';
import { MathService } from './math.service';
import { LoggerMiddleware } from '../middleware/logger.middleware';

@Module({
  controllers: [MathController],
  providers: [MathService],
})
export class MathModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('math');
  }
}
