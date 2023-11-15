import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { IChatRequest, IChatResponse } from './interfaces/chat';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI();
  }

  getMessagesData(request: IChatRequest) {
    return this.openai.chat.completions.create({
      model: this.configService.get('OPENAI_API_MODEL'),
      messages: request.messages,
    });
  }

  getChatOpenaiResponse(message: OpenAI.ChatCompletion): IChatResponse {
    return {
      success: true,
      message: message,
    };
  }
}
