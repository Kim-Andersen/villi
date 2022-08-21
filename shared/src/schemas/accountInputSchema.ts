import { z } from "zod";
import { Account } from '../generated/db';

export const accountInputSchema: z.ZodType<Pick<Account, 'email' | 'full_name' | 'is_admin'>> = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  is_admin: z.boolean()
}).strict();

export type AccountInput = z.infer<typeof accountInputSchema>;
