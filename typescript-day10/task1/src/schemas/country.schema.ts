import { z } from "zod";

export const CountrySchema = z.object({
  names: z.object({
    common: z.string(),
    official: z.string(),
  }),
  capitals: z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .optional(),
  region: z.string().optional(),
  population: z.number().optional(),
  languages: z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .optional(),
  currencies: z
    .array(
      z.object({
        code: z.string(),
        name: z.string(),
        symbol: z.string().optional(),
      }),
    )
    .optional(),
  flag: z
    .object({
      emoji: z.string().optional(),
      url_png: z.string().optional(),
      url_svg: z.string().optional(),
    })
    .optional(),
});

export type Country = z.infer<typeof CountrySchema>;

export const CountrySearchResponseSchema = z.object({
  data: z.object({
    objects: z.array(CountrySchema),
  }),
});
