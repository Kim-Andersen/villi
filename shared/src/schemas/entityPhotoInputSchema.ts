import { z } from "zod";
import { EntityPhoto } from '../generated/db';

export const entityPhotoInputSchema: z.ZodType<Omit<EntityPhoto, 'id'>> = z.object({
  photo_id: z.number().int().min(1),
  vendor_id: z.number().int().optional(),
  location_id: z.number().int().optional(),
  vendor_location_id: z.number().int().optional()
})
  .strict()
  .refine(data => Number.isInteger(data.vendor_id) || Number.isInteger(data.location_id) || Number.isInteger(data.vendor_location_id), {
    message: 'One of vendor_id, location_id or vendor_location_id must be defined.'
  });

export type EntityPhotoInput = z.infer<typeof entityPhotoInputSchema>;
