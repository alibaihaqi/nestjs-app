import { Module } from '@nestjs/common';
import { RtcController } from './rtc.controller';
import { RtcService } from './rtc.service';

@Module({
  controllers: [RtcController],
  providers: [RtcService],
})
export class RtcModule {}
