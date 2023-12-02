import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ApiipController } from './apiip.controller';
import { ApiipService } from './apiip.service';

@Module({
  imports: [HttpModule],
  controllers: [ApiipController],
  providers: [ApiipService],
})
export class ApiipModule {}
