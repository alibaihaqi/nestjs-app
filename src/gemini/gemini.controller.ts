import {
  Body,
  Controller,
  HttpCode,
  MessageEvent,
  Post,
  Sse,
  UsePipes,
} from '@nestjs/common';
import { EnhancedGenerateContentResponse } from '@google/generative-ai';
import { GeminiService } from './gemini.service';
import { Observable, map } from 'rxjs';

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
  getChatStreamsOpenai(): Observable<MessageEvent> {
    return this.geminiService.getStreamMessages().pipe(
      map(
        (message: EnhancedGenerateContentResponse): MessageEvent => ({
          id: String(message.candidates[0].index),
          type: 'gemini-chat',
          data: message.candidates[0],
        }),
      ),
    );
  }
}
