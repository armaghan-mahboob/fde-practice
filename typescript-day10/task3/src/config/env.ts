import { z } from "zod";

const EnvSchema = z.object({
  OFFLINE_MODE: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

export const env = EnvSchema.parse(process.env);
