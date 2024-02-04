import { Injectable } from '@nestjs/common';

import { IRtcClientRequest, IRtcRoom } from './interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { genUlid } from '../utils/ulid';

@Injectable()
export class RtcService {
  constructor(private readonly prismaService: PrismaService) {}

  addClientConnectionId(request: IRtcClientRequest) {
    return this.prismaService['rtc_socket_user'].create({
      data: {
        connectionId: request.connectionId,
        roomId: request.roomId || null,
        isActive: true,
      },
      select: {
        connectionId: true,
        userId: true,
      },
    });
  }

  getClientData(request: IRtcClientRequest) {
    return this.prismaService['rtc_socket_user'].findFirst({
      where: {
        connectionId: request.connectionId,
        isActive: true,
      },
      select: {
        connectionId: true,
      },
    });
  }

  inactiveClientConnection(request: IRtcClientRequest) {
    return this.prismaService['rtc_socket_user'].update({
      where: {
        connectionId: request.connectionId,
      },
      data: {
        isActive: false,
      },
      select: {
        connectionId: true,
        roomId: true,
        isActive: true,
      },
    });
  }

  updateClientUserRoomId(request: IRtcClientRequest) {
    return this.prismaService['rtc_socket_user'].update({
      where: {
        connectionId: request.connectionId,
      },
      data: {
        roomId: request.roomId,
        name: request.name,
      },
      select: {
        connectionId: true,
        roomId: true,
        userId: true,
      },
    });
  }

  createRoom() {
    return this.prismaService['rtc_socket_room'].create({
      data: {
        roomName: genUlid,
        isActive: true,
      },
      select: {
        roomId: true,
      },
    });
  }

  inactiveRoom(request: IRtcRoom) {
    return this.prismaService['rtc_socket_room'].update({
      where: {
        roomId: request.roomId,
      },
      data: {
        isActive: false,
      },
      select: {
        roomId: true,
        isActive: true,
      },
    });
  }

  queryRoomByRoomId(request: IRtcRoom) {
    return this.prismaService['rtc_socket_room'].findFirst({
      where: {
        roomId: request.roomId,
        isActive: true,
      },
      select: {
        roomId: true,
        socketUsers: request.includeUsers
          ? {
              where: {
                isActive: true,
              },
              select: {
                connectionId: true,
                name: true,
              },
            }
          : false || false,
      },
    });
  }
}
