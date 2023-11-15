import { z } from 'zod';

const messageSchema = z.object({
  role: z.enum(['assistant', 'system', 'user']),
  content: z.string(),
});

export const createChatSchema = z
  .object({
    messages: z.array(messageSchema),
  })
  .required();
