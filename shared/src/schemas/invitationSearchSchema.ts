import { z } from "zod";
import { Invitation } from '../generated/db';

export const invitationSearchSchema: z.ZodType<Partial<Pick<Invitation, 'email'>>> = z.object({
  email: z.optional(z.string().email())
}).strict();

export type InvitationSearch = z.infer<typeof invitationSearchSchema>;
