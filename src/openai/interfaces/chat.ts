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

export interface IMessageEvent {
  data: OpenAi.ChatCompletionChunk.Choice;
  id?: string;
  type?: string;
}

export interface ISampleMessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}
