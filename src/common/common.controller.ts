import { Controller, Get } from '@nestjs/common';
import { CommonService, ICommonResponse } from './common.service';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get()
  getCommonResponse(): ICommonResponse {
    return this.commonService.getCommonResponse();
  }
}
