import { Injectable } from '@nestjs/common';
import { IRtcConnectClient } from './interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RtcService {
  constructor(private readonly prismaService: PrismaService) {}

  async addClientConnectionId(request: IRtcConnectClient) {
    return this.prismaService['rtc_socket_user'].create({
      data: {
        connectionId: request.connectionId,
      },
      select: {
        connectionId: true,
        userId: true,
      },
    });
  }
}
