import { z } from "zod";
import { ProductInCollection } from "../generated/db";

export const productInCollectionsInputSchema: z.ZodType<Pick<ProductInCollection, 'product_id'> & { collections: number[] }> = z.object({
  collections: z.array(z.number().int()),
  product_id: z.number().int()
}).strict();

export type ProductInCollectionsInput = z.infer<typeof productInCollectionsInputSchema>;
