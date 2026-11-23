import { z } from "zod";

export const RateSchema = z.object({
  amount: z.number().positive(),
  base: z.string().length(3),
  date: z.string(),
  rates: z.record(z.string().length(3), z.number().positive()),
});

export type RateData = z.infer<typeof RateSchema>;
