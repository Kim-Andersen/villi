import { z } from 'zod';

export const productChannel = z.enum(['online', 'local']);
export type ProductChannel = z.infer<typeof productChannel>;