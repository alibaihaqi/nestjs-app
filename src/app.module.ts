import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { MathModule } from './math/math.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [CommonModule, MathModule, OpenaiModule],
})
export class AppModule {}
