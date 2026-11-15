import { ValidatedWeather } from "../types/weather";

export function validateWeather(data: unknown): ValidatedWeather {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid response: Not an object");
  }

  const raw = data as Record<string, any>;

  if (raw.cod && raw.cod !== 200 && raw.cod !== "200") {
    throw new Error(`API Error: ${raw.message || "Unknown error"}`);
  }

  if (
    typeof raw.temperature === "string" ||
    typeof raw.main?.temp === "string"
  ) {
    throw new Error("Invalid payload: Temperature cannot be a string");
  }

  const temp =
    typeof raw.temperature === "number" ? raw.temperature : raw.main?.temp;
  const high = typeof raw.high === "number" ? raw.high : raw.main?.temp_max;
  const low = typeof raw.low === "number" ? raw.low : raw.main?.temp_min;

  if (
    typeof temp !== "number" ||
    typeof high !== "number" ||
    typeof low !== "number"
  ) {
    throw new Error("Invalid payload: Missing numeric temperature fields");
  }

  let forecast: Array<{ day: string; high: number; low: number }> = [];

  if (Array.isArray(raw.forecast)) {
    forecast = raw.forecast.map((f: any) => {
      if (typeof f.high !== "number" || typeof f.low !== "number" || !f.day) {
        throw new Error("Invalid payload: Malformed forecast day");
      }
      return { day: String(f.day), high: f.high, low: f.low };
    });
  }

  return {
    city: String(raw.city || raw.name || "Unknown"),
    temperature: temp,
    high: high,
    low: low,
    forecast: forecast,
  };
}
