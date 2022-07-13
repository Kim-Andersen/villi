import { z } from "zod";
import { VendorLocation } from '../generated/db';

export const vendorLocationSearchSchema: z.ZodType<Partial<Pick<VendorLocation, 'id' | 'vendor_id' | 'location_id'>>> = z.object({
  id: z.number(),
  vendor_id: z.number(),
  location_id: z.number()
}).strict();

export type VendorLocationSearch = z.infer<typeof vendorLocationSearchSchema>;