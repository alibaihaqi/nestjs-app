interface IChatMessage {
  role: 'assistant' | 'system' | 'user';
  content: string;
}

export interface IChatResponse {
  success: boolean;
  message: IChatMessage;
}
