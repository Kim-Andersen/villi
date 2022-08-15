import { z } from "zod";
import { ProductCollection } from '../types';

export const productCollectionSearchSchema: z.ZodType<Partial<Pick<ProductCollection, 'vendor_id'>>> = z.object({
  vendor_id: z.number().int()
}).strict();

export type ProductCollectionSearch = z.infer<typeof productCollectionSearchSchema>;
