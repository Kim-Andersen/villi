import { z } from "zod";
import { Tagged } from '../types';
import { entityType } from './entityType';

export const taggedSearchSchema: z.ZodType<Omit<Tagged, 'tags'>> = z.object({
  entity_id: z.preprocess(id => Number(id), z.number().int().min(1)),
  type: entityType
}).strict();

export type TaggedSearch = z.infer<typeof taggedSearchSchema>;