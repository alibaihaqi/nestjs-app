import { Injectable } from '@nestjs/common';
import { IChatResponse } from './interfaces/chat';

@Injectable()
export class OpenaiService {
  getChaiOpenaiResponse(): IChatResponse {
    return {
      success: true,
      message: {
        role: 'assistant',
        content: 'test',
      },
    };
  }
}
