export interface IS3Request {
  name: string;
  data: any;
}

export interface IS3Response {
  success: boolean;
  errorMessage?: string;
  assetPath?: string;
}
