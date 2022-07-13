import { z } from "zod";

const twentyForHour = /^([01][0-9]|2[0-3])([0-5][0-9])$/; // ex: "0930"


export const openingHourSchema = z.object({
  open: z.object({
    day: z.number().int().min(0).max(6),
    time: z.string().regex(twentyForHour).nullable()
  }).required(),
  close: z.object({
    day: z.number().int().min(0).max(6),
    time: z.string().regex(twentyForHour).nullable()
  }).nullable()
}).strict();

export const openingHoursSchema = z.array(openingHourSchema).max(7);

export type OpeningHours = z.infer<typeof openingHoursSchema>;