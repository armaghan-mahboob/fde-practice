import { z } from "zod";

export const MeterReadingSchema = z.object({
  meterId: z.string(),
  timestamp: z.string().datetime(),
  cumulativeKwh: z.number().min(0),
});

export type MeterReading = z.infer<typeof MeterReadingSchema>;

export const ReadingListSchema = z.array(MeterReadingSchema);
