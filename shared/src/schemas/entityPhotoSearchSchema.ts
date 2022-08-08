import { z } from "zod";
import { EntityPhoto } from '../generated/db';

export const entityPhotoSearchSchema: z.ZodType<Partial<Omit<EntityPhoto, 'id'>>> = z.object({
  product_id: z.number().int().optional(),
  photo_id: z.number().int().optional(),
  vendor_id: z.number().int().optional(),
  location_id: z.number().int().optional(),
  vendor_location_id: z.number().int().optional()
})
  .strict()
  .refine(data => 
    Number.isInteger(data.product_id) === false || 
    Number.isInteger(data.photo_id) === false || 
    Number.isInteger(data.vendor_id) === false || 
    Number.isInteger(data.location_id) === false || 
    Number.isInteger(data.vendor_location_id) === false, {
      message: 'One of vendor_id, location_id or vendor_location_id must be defined.'
    }
  );

export type EntityPhotoSearch = z.infer<typeof entityPhotoSearchSchema>;
