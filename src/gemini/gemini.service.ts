import { Injectable, MessageEvent } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EnhancedGenerateContentResponse,
  GenerateContentStreamResult,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { Observable } from 'rxjs';
import {
  GeminiChatGetMessageData,
  GeminiChatRequest,
  GeminiChatResponse,
} from './interfaces';
import { genUlid } from '../utils/ulid';

@Injectable()
export class GeminiService {
  private googleGenAiService: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.googleGenAiService = new GoogleGenerativeAI(
      this.configService.get('GEMINI_API_KEY'),
    );
  }
  async getMessagesData(
    request: GeminiChatRequest,
  ): Promise<GeminiChatGetMessageData> {
    const model = this.googleGenAiService.getGenerativeModel({
      model: this.configService.get('GEMINI_CHAT_MODEL'),
    });

    let result: GeminiChatGetMessageData;
    if (request.stream) {
      result = (await model.generateContentStream(
        request.message,
      )) as GenerateContentStreamResult;

      for await (const chunk of result.stream) {
        this.eventEmitter.emit('message', chunk);
      }
    } else {
      result = await model.generateContent(request.message);
    }

    return result;
  }

  getStreamMessages(): Observable<MessageEvent> {
    return new Observable((subscribe) => {
      const listener = (message: EnhancedGenerateContentResponse) => {
        subscribe.next({
          id: genUlid,
          type: 'message.stream.gemini',
          data: message.text(),
        });
      };
      this.eventEmitter.on('message', listener);
      return () => this.eventEmitter.off('message', listener);
    });
  }

  getChatResponse(message: GeminiChatGetMessageData): GeminiChatResponse {
    const result = message.response as EnhancedGenerateContentResponse;
    return {
      success: true,
      result: result?.text && result?.text(),
    };
  }
}
