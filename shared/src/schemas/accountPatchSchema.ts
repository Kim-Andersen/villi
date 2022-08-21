import { z } from "zod";
import { Account } from '../generated/db';

export const accountPatchSchema: z.ZodType<Partial<Pick<Account, 'email' | 'full_name' | 'is_admin' | 'lastlogin_at'>>> = z.object({
  email: z.optional(z.string().email()),
  full_name: z.optional(z.string()),
  is_admin: z.optional(z.boolean()),
  lastlogin_at: z.optional(z.date())
}).strict();

export type AccountPatch = z.infer<typeof accountPatchSchema>;
