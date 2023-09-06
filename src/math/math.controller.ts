import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ISumRequest, ISumResponse } from './interfaces/operation';
import { MathService } from './math.service';

@Controller('math')
export class MathController {
  constructor(private readonly mathService: MathService) {}

  @Post('/sum-loop')
  @HttpCode(200)
  getSumResponseWithLoop(@Body() sumRequest: ISumRequest): ISumResponse {
    return this.mathService.generateSumWithLoop(sumRequest);
  }

  @Post('/sum-multiplication')
  @HttpCode(200)
  getSumResponseWithMultiplication(
    @Body() sumRequest: ISumRequest,
  ): ISumResponse {
    return this.mathService.generateSumWithMultiplication(sumRequest);
  }
}
