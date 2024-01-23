import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { RtcService } from './rtc.service';
import { checkRoomSchema, connectClientSchema } from './dto';

import { ZodValidationPipe } from '../utils/validation-pipes';
import { IRtcConnectClient, IRtcCheckRoomRequest } from './interfaces';

@Controller('rtc')
export class RtcController {
  constructor(private readonly rtcService: RtcService) {}

  @Post('/connect')
  @UsePipes(new ZodValidationPipe(connectClientSchema))
  async handleRtcConnection(@Body() request: IRtcConnectClient): Promise<any> {
    const result = await this.rtcService.addClientConnectionId(request);
    return {
      event: 'connect',
      ...result,
    };
  }

  @Post('/disconnect')
  async handleRtcDisconnect(
    @Req() request: FastifyRequest['raw'],
  ): Promise<any> {
    const result = await this.rtcService.inactiveClientConnection({
      connectionId: request.headers.connectionid as string,
    });
    return {
      event: 'disconnect',
      ...result,
    };
  }

  @Post('/client-id')
  async handleClientId(@Req() request: FastifyRequest['raw']): Promise<any> {
    const result = await this.rtcService.getClientData({
      connectionId: request.headers.connectionid as string,
    });

    return {
      event: 'client-id',
      ...result,
    };
  }

  @Post('/create-room')
  async handleCreateRoom(@Req() request: FastifyRequest['raw']): Promise<any> {
    const room = await this.rtcService.createRoom();
    const result = await this.rtcService.updateClientUserRoomId({
      roomId: room.roomId,
      connectionId: request.headers.connectionid as string,
    });

    return {
      event: 'create-room',
      ...result,
    };
  }

  @Post('/check-room')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(checkRoomSchema))
  async handleCheckRoomAvailability(@Body() request: IRtcCheckRoomRequest) {
    const result = await this.rtcService.checkRoomAvailability(request.roomId);

    if (!result) {
      return {
        success: false,
        errorMsg: 'Room is not found',
      };
    }

    return {
      success: true,
      room: result,
    };
  }
}
