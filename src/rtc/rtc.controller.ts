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
import { connectClientSchema, roomSchema, signalSchema } from './dto';

import { ZodValidationPipe } from '../utils/validation-pipes';
import type { IRtcClientRequest, IRtcRoom, IRtcSignal } from './interfaces';

@Controller('rtc')
export class RtcController {
  constructor(private readonly rtcService: RtcService) {}

  @Post('/connect')
  @UsePipes(new ZodValidationPipe(connectClientSchema))
  async handleRtcConnection(@Body() request: IRtcClientRequest): Promise<any> {
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
    const connectionId = request.headers.connectionid as string;

    const result = await this.rtcService.inactiveClientConnection({
      connectionId: connectionId,
    });

    const getUsersByRoomId = await this.rtcService.queryRoomByRoomId({
      roomId: result.roomId,
      includeUsers: true,
    });

    return {
      success: true,
      message: { event: 'disconnect', success: true },
      actions: [
        {
          action: 'BROADCAST',
          message: {
            connectionId: connectionId,
            event: 'user-disconnected',
          },
          targets: getUsersByRoomId?.socketUsers || [],
        },
        {
          action: 'BROADCAST',
          message: {
            connectedUsers: getUsersByRoomId?.socketUsers || [],
            event: 'room-users',
          },
          targets: getUsersByRoomId?.socketUsers || [],
        },
      ],
    };
  }

  @Post('/create-room')
  async handleCreateRoom(@Req() request: FastifyRequest['raw']): Promise<any> {
    const room = await this.rtcService.createRoom();
    const result = await this.rtcService.updateClientUserRoomId({
      roomId: room.roomId,
      connectionId: request.headers.connectionid as string,
    });

    const getUsersByRoomId = await this.rtcService.queryRoomByRoomId({
      roomId: room.roomId,
      includeUsers: true,
    });

    return {
      success: true,
      message: {
        event: 'create-room',
        success: true,
      },
      actions: [
        {
          action: 'BROADCAST',
          message: {
            ...result,
            event: 'create-room',
          },
          targets: [{ connectionId: result.connectionId }],
        },
        {
          action: 'BROADCAST',
          message: {
            connectedUsers: getUsersByRoomId?.socketUsers || [],
            event: 'room-users',
          },
          targets: getUsersByRoomId?.socketUsers || [],
        },
      ],
    };
  }

  @Post('/check-room')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(roomSchema))
  async handleCheckRoomAvailability(@Body() request: IRtcRoom) {
    const result = await this.rtcService.queryRoomByRoomId({
      roomId: request.roomId,
    });

    if (!result) {
      return {
        success: false,
        errorMsg: 'Room is not found',
      };
    }

    return {
      success: true,
      message: {
        success: true,
        room: result,
      },
    };
  }

  @Post('join-room')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(roomSchema))
  async handleJoinRoom(
    @Req() req: FastifyRequest['raw'],
    @Body() request: IRtcRoom,
  ) {
    try {
      const connectionId = req.headers.connectionid as string;
      await this.rtcService.updateClientUserRoomId({
        connectionId: connectionId,
        roomId: request.roomId,
      });

      const getUsersByRoomId = await this.rtcService.queryRoomByRoomId({
        roomId: request.roomId,
        includeUsers: true,
      });

      return {
        success: true,
        event: 'join-room',
        message: {
          success: true,
        },
        actions: [
          {
            action: 'BROADCAST',
            message: {
              connectedSocketId: connectionId,
              event: 'connection-prepare',
            },
            targets: (getUsersByRoomId?.socketUsers || []).filter(
              (user) => user.connectionId !== connectionId,
            ),
          },
          {
            action: 'BROADCAST',
            message: {
              connectedUsers: getUsersByRoomId?.socketUsers || [],
              event: 'room-users',
            },
            targets: getUsersByRoomId?.socketUsers || [],
          },
        ],
      };
    } catch (error) {
      console.log('Error handleJoinRoom', error);
      return {
        success: false,
        message: `Error handle join room: ${error.message}`,
      };
    }
  }

  @Post('connection-init')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(connectClientSchema))
  async handleConnectionInit(
    @Req() req: FastifyRequest['raw'],
    @Body() request: IRtcClientRequest,
  ) {
    return {
      success: true,
      event: 'connection-init',
      message: {
        success: true,
      },
      actions: [
        {
          action: 'BROADCAST',
          message: {
            connectedSocketId: req.headers.connectionid as string,
            event: 'connection-init',
          },
          targets: [{ connectionId: request.connectionId }],
        },
      ],
    };
  }

  @Post('connection-signal')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(signalSchema))
  async handleConnectionSignal(
    @Req() req: FastifyRequest['raw'],
    @Body() request: IRtcSignal,
  ) {
    return {
      success: true,
      event: 'connection-signal',
      message: {
        success: true,
      },
      actions: [
        {
          action: 'BROADCAST',
          message: {
            connectionId: req.headers.connectionid as string,
            signal: request.signal,
            event: 'connection-signal',
          },
          targets: [{ connectionId: request.connectionId }],
        },
      ],
    };
  }
}
