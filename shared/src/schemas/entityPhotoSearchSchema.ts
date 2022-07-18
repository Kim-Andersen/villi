import { z } from "zod";
import { EntityPhoto } from '../generated/db';
import { entityType } from './entityType';

export const entityPhotoSearchSchema: z.ZodType<Partial<Pick<EntityPhoto, 'id' | 'photo_id' | 'entity_id' | 'entity_type'>>> = z.object({
  id: z.number().int(),
  photo_id: z.number().int(),
  entity_id: z.number().int(),
  entity_type: entityType
}).strict();

export type EntityPhotoSearch = z.infer<typeof entityPhotoSearchSchema>;
