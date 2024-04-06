import { z } from 'zod';

export const createGeminiChatSchema = z
  .object({
    message: z.string(),
    stream: z.boolean().default(false).optional(),
  })
  .required();
