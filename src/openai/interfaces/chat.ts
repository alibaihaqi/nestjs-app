import OpenAi from 'openai';

interface IChatMessage {
  role: 'assistant' | 'system' | 'user';
  content: string;
}

export interface IChatRequest {
  messages: IChatMessage[];
  stream?: boolean;
}

export interface IChatResponse {
  success: boolean;
  message: OpenAi.ChatCompletion.Choice;
}
