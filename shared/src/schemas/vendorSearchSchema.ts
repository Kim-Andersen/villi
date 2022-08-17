import { z } from "zod";
import { Vendor } from '../generated/db';
import { optionalNullableString } from './helpers';

type Props = Partial<Pick<Vendor, 'name' | 'description' | 'website_url' | 'facebook_url' | 'instagram_url'>>;

export const vendorSearchSchema: z.ZodType<Props> = z.object({
  name: z.string(),
  description: optionalNullableString,
  website_url: optionalNullableString,
  instagram_url: optionalNullableString,
  facebook_url: optionalNullableString
}).strict();

export type VendorSearch = z.infer<typeof vendorSearchSchema>;