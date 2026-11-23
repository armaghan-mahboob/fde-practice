import { z } from "zod";

const EnvSchema = z.object({
  AIR_QUALITY_API_KEY: z.string().optional(),
  WEATHER_API_KEY: z.string().optional(),
  OFFLINE_MODE: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

export const env = EnvSchema.parse(process.env);
