import { z } from "zod";
import { EntityPhoto, entityType } from '../types';

export const entityPhotoInputSchema: z.ZodType<Omit<EntityPhoto, 'id'>> = z.object({
  photo_id: z.number().int().min(1),
  entity_id: z.number().int().min(1),
  entity_type: entityType
}).strict();

export type EntityPhotoInput = z.infer<typeof entityPhotoInputSchema>;
