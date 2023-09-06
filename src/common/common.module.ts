import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { LoggerMiddleware } from '../middleware/logger.middleware';

@Module({
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('common');
  }
}
