import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { APIPromise } from 'openai/core';
// import { ReadableStream } from 'node:stream/web';
import { createReadStream, rmSync, writeFileSync } from 'node:fs';
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

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  getMessagesData(request: IChatRequest): APIPromise<OpenAI.ChatCompletion> {
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

      return {
        success: true,
        data: buffer,
        name: `${this.configService.get(
          'AWS_OPENAI_PATH',
        )}/audio/audio-${genUlid}.${response_format}`,
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

      const name = `speech-${genUlid}.mp3`;
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
