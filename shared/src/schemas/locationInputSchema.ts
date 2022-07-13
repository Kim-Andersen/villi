import { z } from "zod";
import { Location } from '../generated/db';

export const locationInputSchema: z.ZodType<Omit<Location, 'id' | 'created_at' | 'updated_at'>> = z.object({
  name: z.string(),
  description: z.string().optional(),
  street_name: z.string(),
  street_number: z.string(),
  postal_code: z.string(),
  city: z.string(),
  country: z.string(),
  point: z.array(z.number()).min(2).max(2)
}).strict();

export type LocationInput = z.infer<typeof locationInputSchema>;
