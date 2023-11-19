import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createReadStream, rmSync, writeFileSync } from 'node:fs';
// import { ReadableStream } from 'node:stream/web';
import OpenAI from 'openai';
import { Stream } from 'openai/streaming';
import { Observable } from 'rxjs';

import {
  IAudioMessageRequest,
  IAudioMessageResponse,
  IChatRequest,
  IChatResponse,
  ITranscriptionToTextRequest,
} from './interfaces';
import { genUlid } from '../utils/ulid';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private readonly eventEmitter: EventEmitter2;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async getMessagesData(
    request: IChatRequest,
  ): Promise<OpenAI.ChatCompletion | Stream<OpenAI.ChatCompletionChunk>> {
    const response = await this.openai.chat.completions.create({
      model: this.configService.get('OPENAI_API_MODEL'),
      messages: request.messages,
      stream: request.stream || false,
    });

    if (request.stream) {
      this.eventEmitter.emit('chatMessageCreated', response);
    }

    return response;
  }

  getStreamMessages(): Observable<OpenAI.ChatCompletionChunk> {
    return new Observable((subscribe) => {
      const listener = (message: OpenAI.ChatCompletionChunk) => {
        subscribe.next(message);
      };
      this.eventEmitter.on('chatMessageCreated', listener);
      return () => this.eventEmitter.off('chatMessageCreated', listener);
    });
  }

  getChatOpenaiResponse(message: OpenAI.ChatCompletion): IChatResponse {
    return {
      success: true,
      message: message.choices[0],
    };
  }

  async getAudioSpeechData(
    request: IAudioMessageRequest,
  ): Promise<IAudioMessageResponse> {
    const response_format =
      request.response_format ||
      this.configService.get('OPENAI_API_AUDIO_OUTPUT');

    const audioRequest: OpenAI.Audio.Speech.SpeechCreateParams = {
      ...request,
      model: this.configService.get('OPENAI_API_AUDIO_MODEL'),
      response_format,
    };

    try {
      const audioResponse = await this.openai.audio.speech.create(audioRequest);
      const buffer = Buffer.from(await audioResponse.arrayBuffer());
      const assetName = `audio-${genUlid}.${response_format}`;

      return {
        success: true,
        assetPath: `${this.configService.get(
          'AWS_OPENAI_PATH',
        )}/audio/${assetName}`,
        data: buffer,
        name: assetName,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: error,
      };
    }
  }

  async getTranscriptionsFromOpenai(request: ITranscriptionToTextRequest) {
    try {
      const respArrayBuffer = await request.data.transformToByteArray();
      const bufferData = Buffer.from(respArrayBuffer);

      // TODO: Find another way to directly do the transcription from buffer
      // data and connect to OpenAI without saving it first.
      // const bufferStream = new ReadableStream(respArrayBuffer);

      const name = `${this.configService.get(
        'OPENAI_API_TRANSCRIPTIONS_LOCAL_PATH',
      )}/speech-${genUlid}.mp3`;
      writeFileSync(name, bufferData);

      const response = await this.openai.audio.transcriptions.create({
        // file: bufferStream,
        file: createReadStream(name),
        model: this.configService.get('OPENAI_API_TRANSCRIPTIONS_MODEL'),
      });

      rmSync(name);

      return {
        success: true,
        text: response.text,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: error,
      };
    }
  }
}
