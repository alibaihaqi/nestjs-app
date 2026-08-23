import { GenerateContentResponse } from '@google/genai';

export interface GeminiChatRequest {
  message: string;
  stream: boolean;
}

export interface GeminiChatResponse {
  success: boolean;
  result: string | null;
}

export type GeminiChatStreamResult = AsyncGenerator<GenerateContentResponse>;

export type GeminiChatGetMessageData =
  | GenerateContentResponse
  | GeminiChatStreamResult
  | null;
