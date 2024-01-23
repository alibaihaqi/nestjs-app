import { z } from 'zod';

export const connectClientSchema = z
  .object({
    connectionId: z.string(),
  })
  .required();

export const roomSchema = z
  .object({
    roomId: z.string(),
  })
  .required();
