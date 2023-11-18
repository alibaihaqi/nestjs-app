export interface IS3UploadRequest {
  name: string;
  data: any;
}

export interface IS3UploadResponse {
  success: boolean;
  errorMessage?: string;
  assetPath?: string;
}

export interface IS3GetAssetRequest {
  assetPath: string;
  bucketName?: string;
}
