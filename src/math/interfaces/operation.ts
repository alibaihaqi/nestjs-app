import { z } from 'zod';
import { createSumSchema } from '../dto/operation';

export type TSumRequest = z.infer<typeof createSumSchema>;

export interface ISumResponse {
  success: boolean;
  result: number;
  timeInMili: number;
}
