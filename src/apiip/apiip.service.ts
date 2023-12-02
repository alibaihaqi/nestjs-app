import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

import {
  IGetClientCountryResponse,
  IGetClientCountryServiceRequest,
} from './interfaces';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';

@Injectable()
export class ApiipService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getClientCountry(params: IGetClientCountryServiceRequest) {
    const APIIP_CHECK_URL = this.configService.get('APIIP_CHECK_URL');
    const APIIP_KEY = this.configService.get('APIIP_KEY');

    const { data } = await firstValueFrom(
      this.httpService
        .get(`${APIIP_CHECK_URL}?ip=${params.clientIp}&accessKey=${APIIP_KEY}`)
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );

    return data;
  }

  generateCountryResponse(response: any): IGetClientCountryResponse {
    return {
      success: true,
      country: response?.countryName || '',
    };
  }
}
