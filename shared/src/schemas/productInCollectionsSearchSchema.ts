import { z } from "zod";
import { ProductInCollection } from "../generated/db";

export const productInCollectionsSearchSchema: z.ZodType<Pick<ProductInCollection, 'product_id'>> = z.object({
  product_id: z.number().int()
}).strict();

export type ProductInCollectionsSearch = z.infer<typeof productInCollectionsSearchSchema>;
