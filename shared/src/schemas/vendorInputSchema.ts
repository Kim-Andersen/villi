import { z } from "zod";
import { Vendor } from '../generated/db';

export const vendorInputSchema: z.ZodType<Omit<Vendor, 'id' | 'created_at' | 'updated_at'>> = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  website_url: z.string().nullable().optional(),
  instagram_url: z.string().nullable().optional(),
  facebook_url: z.string().nullable().optional()
}).strict();

export type VendorInput = z.infer<typeof vendorInputSchema>;
