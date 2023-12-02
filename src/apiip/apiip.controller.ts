import { Controller, Get, Query } from '@nestjs/common';
import { ApiipService } from './apiip.service';
import { IGetClientCountryResponse } from './interfaces';

@Controller('apiip')
export class ApiipController {
  constructor(private readonly apiipService: ApiipService) {}

  @Get('/check')
  async getClientCountry(
    @Query('ip') clientIp: string,
  ): Promise<IGetClientCountryResponse> {
    const response = await this.apiipService.getClientCountry({
      clientIp: clientIp,
    });

    return this.apiipService.generateCountryResponse(response);
  }
}
