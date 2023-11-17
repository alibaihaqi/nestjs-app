import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { createChatSchema, audioRequestSchema } from './dto';
import {
  IAudioMessageRequest,
  IChatRequest,
  IChatResponse,
} from './interfaces';
import { IS3Response } from '../aws/interfaces';
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
    const getMessages = await this.openaiService.getMessagesData(request);
    return this.openaiService.getChatOpenaiResponse(getMessages);
  }

  @Post('/text-to-audio')
  @UsePipes(new ZodValidationPipe(audioRequestSchema))
  @HttpCode(200)
  async getTextToAudio(
    @Body() request: IAudioMessageRequest,
  ): Promise<IS3Response> {
    try {
      const speechData = await this.openaiService.getAudioSpeechData(request);

      if (!speechData.success) {
        throw {
          success: speechData.success,
          errorMessage: speechData.errorMessage,
        };
      }

      const awsResponse = await this.awsService.uploadDataToAwsS3Bucket({
        name: speechData.name,
        data: speechData.data,
      });

      if (!awsResponse.success) {
        throw {
          success: awsResponse.success,
          errorMessage: awsResponse.errorMessage,
        };
      }

      return awsResponse;
    } catch (error) {
      return error;
    }
  }
}
