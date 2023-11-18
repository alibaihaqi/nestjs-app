import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  IS3GetAssetRequest,
  IS3UploadRequest,
  IS3UploadResponse,
} from './interfaces';

@Injectable()
export class AwsService {
  private awsClient: S3Client;

  constructor(private configService: ConfigService) {
    this.awsClient = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_ACCESS_KEY_SECRET'),
      },
      region: this.configService.get('AWS_BUCKET_REGION'),
    });
  }

  async uploadDataToAwsS3Bucket(
    request: IS3UploadRequest,
  ): Promise<IS3UploadResponse> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Body: request.data,
      Key: request.name,
    });

    try {
      await this.awsClient.send(command);

      return {
        success: true,
        assetPath: `${this.configService.get('CLOUD_CDN_URL')}/${request.name}`,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: error,
      };
    }
  }

  async getAssetFromS3Bucket(request: IS3GetAssetRequest) {
    const command = new GetObjectCommand({
      Key: request.assetPath,
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
    });

    try {
      const response: GetObjectCommandOutput =
        await this.awsClient.send(command);

      return {
        success: true,
        data: response.Body,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: error,
      };
    }
  }
}
