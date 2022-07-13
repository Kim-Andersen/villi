import { z } from "zod";
import { Location } from '../generated/db';

type LocationSearchAttributes = Pick<Location, 'name' | 'description' | 'street_name' | 'street_number' | 'postal_code' | 'city' | 'country'>;

export const locationSearchSchema: z.ZodType<Partial<LocationSearchAttributes>> = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  street_name: z.string().optional(),
  street_number: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional()
}).strict();

export type LocationSearch = z.infer<typeof locationSearchSchema>;