import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../utils/validation-pipes';
import { createSumSchema } from './dto/operation';
import { TSumRequest, ISumResponse } from './interfaces/operation';
import { MathService } from './math.service';

@Controller('math')
export class MathController {
  constructor(private readonly mathService: MathService) {}

  @Post('/sum-loop')
  @UsePipes(new ZodValidationPipe(createSumSchema))
  @HttpCode(200)
  getSumResponseWithLoop(@Body() sumRequest: TSumRequest): ISumResponse {
    return this.mathService.generateSumWithLoop(sumRequest);
  }

  @Post('/sum-multiplication')
  @UsePipes(new ZodValidationPipe(createSumSchema))
  @HttpCode(200)
  getSumResponseWithMultiplication(
    @Body() sumRequest: TSumRequest,
  ): ISumResponse {
    return this.mathService.generateSumWithMultiplication(sumRequest);
  }
}
