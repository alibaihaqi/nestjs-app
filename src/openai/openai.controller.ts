import {
  Body,
  Controller,
  HttpCode,
  Post,
  Sse,
  UsePipes,
} from '@nestjs/common';
import OpenAI from 'openai';
import { Observable, interval, map } from 'rxjs';

import { OpenaiService } from './openai.service';
import {
  audioRequestSchema,
  createChatSchema,
  imageRequestSchema,
  transcriptionRequestSchema,
} from './dto';
import {
  IAudioMessageRequest,
  IChatRequest,
  IChatResponse,
  IImageGenerationRequest,
  IMessageEvent,
  ISampleMessageEvent,
  ITranscriptionRequest,
} from './interfaces';
import { IS3UploadResponse } from '../aws/interfaces';
import { AwsService } from '../aws/aws.service';
import { ZodValidationPipe } from '../utils/validation-pipes';

@Controller('openai')
export class OpenaiController {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly awsService: AwsService,
  ) {}

  @Post('/chat')
  @UsePipes(new ZodValidationPipe(createChatSchema))
  @HttpCode(200)
  async getChatOpenai(@Body() request: IChatRequest): Promise<IChatResponse> {
    const getMessages = (await this.openaiService.getMessagesData(
      request,
    )) as OpenAI.ChatCompletion;
    return this.openaiService.getChatOpenaiResponse(getMessages);
  }

  @Sse('/chat-streams')
  getChatStreamsOpenai(): Observable<IMessageEvent> {
    return this.openaiService.getStreamMessages().pipe(
      map((message: OpenAI.ChatCompletionChunk) => ({
        id: message.id,
        type: message.object,
        data: message.choices[0],
      })),
    );
  }

  @Sse('/sse')
  sse(): Observable<ISampleMessageEvent> {
    return interval(1000).pipe(map(() => ({ data: { hello: 'world' } })));
  }

  @Post('/text-to-audio')
  @UsePipes(new ZodValidationPipe(audioRequestSchema))
  @HttpCode(200)
  async getTextToAudio(
    @Body() request: IAudioMessageRequest,
  ): Promise<IS3UploadResponse> {
    try {
      const speechData = await this.openaiService.getAudioSpeechData(request);

      if (!speechData.success) {
        throw {
          success: speechData.success,
          errorMessage: speechData.errorMessage,
        };
      }

      const awsResponse = await this.awsService.uploadDataToAwsS3Bucket({
        name: speechData.assetPath,
        data: speechData.data,
      });

      if (!awsResponse.success) {
        throw {
          success: awsResponse.success,
          errorMessage: awsResponse.errorMessage,
        };
      }

      return {
        ...awsResponse,
        name: speechData.name,
      };
    } catch (error) {
      return error;
    }
  }

  @Post('/transcriptions-from-cloud')
  @UsePipes(new ZodValidationPipe(transcriptionRequestSchema))
  @HttpCode(200)
  async getTranscriptionAudioToText(
    @Body() request: ITranscriptionRequest,
  ): Promise<IS3UploadResponse> {
    try {
      const getAssetData = await this.awsService.getAssetFromS3Bucket({
        assetPath: request.assetPath,
      });

      if (!getAssetData.success) {
        throw {
          success: getAssetData.success,
          errorMessage: getAssetData.errorMessage,
        };
      }

      const getTranscriptionResult =
        await this.openaiService.getTranscriptionsFromOpenai({
          data: getAssetData.data,
        });

      if (!getTranscriptionResult.success) {
        throw {
          success: getTranscriptionResult.success,
          errorMessage: getTranscriptionResult.errorMessage,
        };
      }

      return getTranscriptionResult;
    } catch (error) {
      return error;
    }
  }

  @Post('/image-generation')
  @UsePipes(new ZodValidationPipe(imageRequestSchema))
  @HttpCode(200)
  async getImageGenerationsApi(@Body() request: IImageGenerationRequest) {
    return this.openaiService.getImageGenerations(request);
  }
}
