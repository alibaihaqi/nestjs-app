import { Injectable, MessageEvent } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { Observable } from 'rxjs';
import {
  GeminiChatGetMessageData,
  GeminiChatRequest,
  GeminiChatResponse,
  GeminiChatStreamResult,
} from './interfaces';
import { genUlid } from '../utils/ulid';

function isStreamResult(
  message: NonNullable<GeminiChatGetMessageData>,
): message is GeminiChatStreamResult {
  return Symbol.asyncIterator in message;
}

@Injectable()
export class GeminiService {
  private googleGenAiService: GoogleGenAI;

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.googleGenAiService = new GoogleGenAI({
      apiKey: this.configService.get('GEMINI_API_KEY'),
    });
  }

  async getMessagesData(
    request: GeminiChatRequest,
  ): Promise<GeminiChatGetMessageData> {
    const model = this.configService.get('GEMINI_CHAT_MODEL');

    let result: GeminiChatGetMessageData;
    if (request.stream) {
      result = await this.googleGenAiService.models.generateContentStream({
        model,
        contents: request.message,
      });

      for await (const chunk of result) {
        this.eventEmitter.emit('message', chunk);
      }
    } else {
      result = await this.googleGenAiService.models.generateContent({
        model,
        contents: request.message,
      });
    }

    return result;
  }

  getStreamMessages(): Observable<MessageEvent> {
    return new Observable((subscribe) => {
      const listener = (message: GenerateContentResponse) => {
        subscribe.next({
          id: genUlid,
          type: 'message.stream.gemini',
          data: message.text,
        });
      };
      this.eventEmitter.on('message', listener);
      return () => this.eventEmitter.off('message', listener);
    });
  }

  getChatResponse(message: GeminiChatGetMessageData): GeminiChatResponse {
    if (message === null || isStreamResult(message)) {
      return { success: true, result: null };
    }

    return { success: true, result: message.text ?? null };
  }
}
