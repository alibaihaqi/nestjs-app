import { Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { createChatSchema } from './dto/chat';
import { IChatResponse } from './interfaces/chat';
import { ZodValidationPipe } from '../utils/validation-pipes';
@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('/chat')
  @UsePipes(new ZodValidationPipe(createChatSchema))
  @HttpCode(200)
  getChatOpenai(): IChatResponse {
    return this.openaiService.getChaiOpenaiResponse();
  }
}
