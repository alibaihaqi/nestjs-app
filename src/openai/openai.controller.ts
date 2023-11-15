import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { createChatSchema } from './dto/chat.dto';
import { IChatRequest, IChatResponse } from './interfaces/chat';
import { ZodValidationPipe } from '../utils/validation-pipes';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('/chat')
  @UsePipes(new ZodValidationPipe(createChatSchema))
  @HttpCode(200)
  async getChatOpenai(@Body() request: IChatRequest): Promise<IChatResponse> {
    const getMessages = await this.openaiService.getMessagesData(request);
    return this.openaiService.getChatOpenaiResponse(getMessages);
  }
}
