import { WeatherConfig } from "../types/weather";

declare const process: {
  env: { [key: string]: string | undefined };
};

export function loadConfig(): WeatherConfig {
  const city = process.env.WEATHER_CITY || "London";
  const apiEndpoint =
    process.env.WEATHER_API_ENDPOINT ||
    "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = process.env.WEATHER_API_KEY;

  return { city, apiEndpoint, apiKey };
}
