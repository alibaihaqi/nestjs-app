import {
  Body,
  Controller,
  HttpCode,
  MessageEvent,
  Post,
  Sse,
  UsePipes,
} from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { Observable } from 'rxjs';

import { createGeminiChatSchema } from './dto';
import { GeminiChatRequest } from './interfaces';
import { ZodValidationPipe } from '../utils/validation-pipes';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('/chat')
  @UsePipes(new ZodValidationPipe(createGeminiChatSchema))
  @HttpCode(200)
  async getChatOpenai(@Body() request: GeminiChatRequest) {
    const getMessages = await this.geminiService.getMessagesData(request);
    return this.geminiService.getChatResponse(getMessages);
  }

  @Sse('/stream')
  @HttpCode(200)
  getChatStreamsGemini(): Observable<MessageEvent> {
    return this.geminiService.getStreamMessages().pipe();
  }
}
