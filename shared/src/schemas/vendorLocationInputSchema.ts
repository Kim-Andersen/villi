import { z } from "zod";
import { VendorLocation } from '../generated/db';
import { locationTypeEnum } from './locationType';
import { openingHoursSchema } from './openingHoursSchema';

export const vendorLocationInputSchema: z.ZodType<Omit<VendorLocation, 'id' | 'created_at' | 'updated_at'>> = z.object({
  vendor_id: z.number(),
  location_id: z.number(),
  types: z.array(locationTypeEnum),
  note: z.string().optional(),
  opening_hours: openingHoursSchema.optional()
}).strict();

export type VendorLocationInput = z.infer<typeof vendorLocationInputSchema>;
