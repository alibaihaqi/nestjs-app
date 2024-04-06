import {
  GenerateContentResult,
  GenerateContentStreamResult,
} from '@google/generative-ai';

export interface GeminiChatRequest {
  message: string;
  stream: boolean;
}

export interface GeminiChatResponse {
  success: boolean;
  result: string | null;
}

export type GeminiChatGetMessageData =
  | GenerateContentResult
  | GenerateContentStreamResult
  | null;
