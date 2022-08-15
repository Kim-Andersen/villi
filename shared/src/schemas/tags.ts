import { z } from 'zod';

export const tagEnum = z.enum([
  'farm', 
  'self-service', 
  'organic',
  'direct-selling'
]);
export type Tag = z.infer<typeof tagEnum>;