import { z } from "zod";
import { Photo } from '../generated/db';
import { photoSize } from './photoSize';

export const photoInputSchema: z.ZodType<Omit<Photo, 'id' | 'created_at'>> = z.object({
  sizes: z.array(photoSize),
  content_type: z.string(),
  key: z.string(),
  bucket: z.string(),
}).strict();

export type PhotoInput = z.infer<typeof photoInputSchema>;
