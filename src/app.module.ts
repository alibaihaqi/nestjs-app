import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { MathModule } from './math/math.module';

@Module({
  imports: [CommonModule, MathModule],
})
export class AppModule {}
