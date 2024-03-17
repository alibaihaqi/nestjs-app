import {
  EnhancedGenerateContentResponse,
  GenerateContentResult,
  GenerateContentStreamResult,
} from '@google/generative-ai';

export interface GeminiChatRequest {
  message: string;
  stream: boolean;
}

export interface GeminiChatResponse {
  success: boolean;
  result:
    | EnhancedGenerateContentResponse
    | Promise<EnhancedGenerateContentResponse>
    | null;
}

export type GeminiChatGetMessageData =
  | GenerateContentResult
  | GenerateContentStreamResult
  | null;
