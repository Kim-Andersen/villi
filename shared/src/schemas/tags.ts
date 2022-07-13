import { z } from 'zod';

export const tagEnum = z.enum([
  'farm', 
  'self-service', 
  'organic'
]);
export type Tag = z.infer<typeof tagEnum>;