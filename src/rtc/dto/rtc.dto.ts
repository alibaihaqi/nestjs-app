import { z } from 'zod';

export const connectClientSchema = z
  .object({
    connectionId: z.string(),
  })
  .required();

export const checkRoomSchema = z
  .object({
    roomId: z.string(),
  })
  .required();
