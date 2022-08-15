import { z } from "zod";
import { ProductCollection } from '../generated/db';
import { optionalNullableString } from './helpers';

export const productCollectionInputSchema: z.ZodType<Omit<ProductCollection, 'id'>> = z.object({
  vendor_id: z.number().int(),
  name: z.string(),
  description: optionalNullableString
}).strict();

export type ProductCollectionInput = z.infer<typeof productCollectionInputSchema>;
