import { Injectable } from '@nestjs/common';

export interface ICommonResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class CommonService {
  getCommonResponse(): ICommonResponse {
    return {
      success: true,
      message: 'Nest JS is running!',
    };
  }
}
