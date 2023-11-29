import OpenAi from 'openai';

export interface IChatRequest {
  messages: OpenAi.ChatCompletionMessage[];
  n?: number;
  presence_penalty: number | null;
  stream?: boolean;
}

export interface IChatResponse {
  success: boolean;
  message: OpenAi.ChatCompletion.Choice;
}
