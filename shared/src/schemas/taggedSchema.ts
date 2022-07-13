import { z } from "zod";
import { Tagged } from '../types';
import { entityType } from './entityType';
import { tagEnum } from './tags';

export const taggedSchema: z.ZodType<Tagged> = z.object({
  entity_id: z.number().int().min(1),
  type: entityType,
  tags: z.array(tagEnum)
}).strict();

