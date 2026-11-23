import { z } from "zod";

export const PollutantMeasurementSchema = z.object({
  value: z.number().min(0, "Pollutant value cannot be negative"),
  unit: z.string(),
});

export const AirQualityResponseSchema = z.object({
  station: z.string(),
  observedAt: z.string().datetime(),
  pm25: PollutantMeasurementSchema.optional(),
  no2: PollutantMeasurementSchema.optional(),
});

export type AirQualityData = z.infer<typeof AirQualityResponseSchema>;

export const WeatherResponseSchema = z.object({
  temperatureCelsius: z.number(),
  humidityPercent: z.number().min(0).max(100),
  condition: z.string(),
});

export type WeatherData = z.infer<typeof WeatherResponseSchema>;
