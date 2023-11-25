import { z } from 'zod';

const messageSchema = z.object({
  role: z.enum(['assistant', 'system', 'user']),
  content: z.string().nonempty('content cannot be empty'),
});

export const createChatSchema = z
  .object({
    messages: z.array(messageSchema).min(1),
    n: z.number().default(1).optional(),
    presence_penalty: z.number().min(-2).max(2).default(0).optional(),
    stream: z.boolean().default(false).optional(),
  })
  .required();

export const audioRequestSchema = z
  .object({
    input: z.string().nonempty('content cannot be empty'),
    voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']),
  })
  .required();

export const imageRequestSchema = z
  .object({
    input: z.string().nonempty('Input cannot be empty'),
  })
  .required();

export const transcriptionRequestSchema = z
  .object({
    assetPath: z.string().nonempty('Asset Path cannot be empty'),
  })
  .required();
