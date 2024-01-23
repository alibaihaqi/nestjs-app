import { Injectable } from '@nestjs/common';

import { IRtcConnectClient, IRtcClientRequest } from './interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { genUlid } from '../utils/ulid';

@Injectable()
export class RtcService {
  constructor(private readonly prismaService: PrismaService) {}

  addClientConnectionId(request: IRtcConnectClient) {
    return this.prismaService['rtc_socket_user'].create({
      data: {
        connectionId: request.connectionId,
        isActive: true,
      },
      select: {
        connectionId: true,
        userId: true,
      },
    });
  }

  inactiveClientConnection(request: IRtcConnectClient) {
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
        userId: true,
        isActive: true,
      },
    });
  }

  getClientData(request: IRtcClientRequest) {
    return this.prismaService['rtc_socket_user'].findFirst({
      where: {
        connectionId: request.connectionId,
      },
      select: {
        connectionId: true,
        roomId: true,
        userId: true,
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
        roomName: true,
      },
    });
  }

  checkRoomAvailability(roomId: string) {
    return this.prismaService['rtc_socket_room'].findFirst({
      where: {
        roomId,
      },
      select: {
        roomId: true,
        roomName: true,
      },
    });
  }
}
