import { z } from "zod";
import { Photo } from '../types';

export const photoSearchSchema: z.ZodType<Partial<Pick<Photo, 'bucket'>>> = z.object({
  bucket: z.string().min(1),
}).strict();

export type PhotoSearch = z.infer<typeof photoSearchSchema>;
