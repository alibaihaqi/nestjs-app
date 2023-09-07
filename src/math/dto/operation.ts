import { z } from 'zod';

export const createSumSchema = z
  .object({
    number: z.number(),
  })
  .required();
