import { z } from 'zod';

const messageSchema = z.object({
  role: z.enum(['assistant', 'system', 'user']),
  content: z.string().nonempty('content cannot be empty'),
});

export const createChatSchema = z
  .object({
    messages: z.array(messageSchema).min(1),
  })
  .required();

export const audioRequestSchema = z
  .object({
    input: z.string().nonempty('content cannot be empty'),
    voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']),
  })
  .required();
