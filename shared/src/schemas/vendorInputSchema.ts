import { z } from "zod";
import { Vendor } from '../generated/db';
import { optionalNullableString } from './helpers';

export const vendorInputSchema: z.ZodType<Omit<Vendor, 'id' | 'created_at' | 'updated_at'>> = z.object({
  name: z.string().min(1),
  description: optionalNullableString,
  website_url: optionalNullableString,
  instagram_url: optionalNullableString,
  facebook_url: optionalNullableString,
  youtube_url: optionalNullableString,
  email: optionalNullableString,
  phone: optionalNullableString
}).strict();

export type VendorInput = z.infer<typeof vendorInputSchema>;
