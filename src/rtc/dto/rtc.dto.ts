import { z } from 'zod';

export const connectClientSchema = z
  .object({
    connectionId: z.string(),
  })
  .required();
