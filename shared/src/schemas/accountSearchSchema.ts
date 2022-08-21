import { z } from "zod";
import { Account } from '../generated/db';

export const accountSearchSchema: z.ZodType<Partial<Pick<Account, 'id' | 'email'>>> = z.object({
  id: z.optional(z.number().int()),
  email: z.optional(z.string().email())
}).strict();

export type AccountSearch = z.infer<typeof accountSearchSchema>;
