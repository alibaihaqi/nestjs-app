import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { IS3Request, IS3Response } from './interfaces';

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

  async uploadDataToAwsS3Bucket(request: IS3Request): Promise<IS3Response> {
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
}
