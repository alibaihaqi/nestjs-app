export interface IGetClientCountryServiceRequest {
  clientIp: string;
}

export interface IGetClientCountryResponse {
  success: boolean;
  country: string;
}
