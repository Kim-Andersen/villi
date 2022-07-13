import { z } from "zod";
import { Vendor } from '../generated/db';

export const vendorSearchSchema: z.ZodType<Partial<Pick<Vendor, 'name' | 'description' | 'website_url' | 'facebook_url' | 'instagram_url'>>> = z.object({
  name: z.string(),
  description: z.string(),
  website_url: z.string(),
  instagram_url: z.string(),
  facebook_url: z.string()
}).strict();

export type VendorSearch = z.infer<typeof vendorSearchSchema>;