import { z } from "zod";
import { entityType } from './entityType';

export const entityPhotoSearchSchema = z.object({
  entityType: entityType,
  entityId: z.number(),
  photo_id: z.optional(z.number().int()),
}).strict();

export type EntityPhotoSearch = z.infer<typeof entityPhotoSearchSchema>;
