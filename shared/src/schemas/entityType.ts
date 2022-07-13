import { z } from 'zod';

export const entityType = z.enum([
  'location',
  'vendor', 
  'vendor_location'
]);
export type EntityType = z.infer<typeof entityType>;