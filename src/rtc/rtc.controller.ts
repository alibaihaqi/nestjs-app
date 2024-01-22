import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { RtcService } from './rtc.service';
import { connectClientSchema } from './dto';

import { ZodValidationPipe } from '../utils/validation-pipes';
import { IRtcConnectClient } from './interfaces';

@Controller('rtc')
export class RtcController {
  constructor(private readonly rtcService: RtcService) {}

  @Post('/connect')
  @UsePipes(new ZodValidationPipe(connectClientSchema))
  async handleRtcConnection(@Body() request: IRtcConnectClient): Promise<any> {
    return this.rtcService.addClientConnectionId(request);
  }
}
