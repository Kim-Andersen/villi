import { z } from "zod";
import { Product } from '../generated/db';
import { productChannel } from './productChannel';

export const productInputSchema: z.ZodType<Omit<Product, 'id' | 'created_at' | 'updated_at'>> = z.object({
  title: z.string(),
  description: z.string(),
  vendor_id: z.number().int(),
  offer_id: z.string().min(1),  
  channel: productChannel,
  price: z.number().positive(),
  sale_price: z.number().positive().optional(),
  currency: z.number().int(),
  highlights: z.array(z.string())
  
}).strict();

export type ProductInput = z.infer<typeof productInputSchema>;
