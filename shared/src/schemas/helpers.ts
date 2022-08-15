import { z } from "zod";

export const optionalNullableString = z.optional(z.string().nullable());