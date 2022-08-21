import { z } from "zod";
import { Invitation } from '../generated/db';

export const invitationInputSchema: z.ZodType<Pick<Invitation, 'email' | 'invited_by'>> = z.object({
  email: z.string().email(),
  invited_by: z.number().int()
}).strict();

export type InvitationInput = z.infer<typeof invitationInputSchema>;
