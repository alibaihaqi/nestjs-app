export interface IAudioMessageRequest {
  input: string;
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  response_format?: 'mp3' | 'opus' | 'aac' | 'flac';
}

export interface IAudioOpenaiRequest extends IAudioMessageRequest {
  model: string;
}

export interface IAudioMessageResponse {
  success: boolean;
  errorMessage?: string;
  name?: string;
  assetPath?: string;
  data?: any;
}

export interface ITranscriptionRequest {
  assetPath: string;
}

export interface ITranscriptionToTextRequest {
  // TODO: Change data type generated by AWS S3
  data: any;
}