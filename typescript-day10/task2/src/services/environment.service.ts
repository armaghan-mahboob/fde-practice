import { fetchAirQuality, fetchWeather } from "../api/providers";
import { AirQualityData, WeatherData } from "../schemas/airQuality.schema";

export interface EnvironmentReport {
  airQuality: AirQualityData | null;
  weather: WeatherData | null;
  errors: string[];
}

export async function getEnvironmentData(
  location: string,
): Promise<EnvironmentReport> {
  const errors: string[] = [];

  const results = await Promise.allSettled([
    fetchAirQuality(location),
    fetchWeather(location),
  ]);

  const [aqResult, weatherResult] = results;

  let airQuality: AirQualityData | null = null;
  let weather: WeatherData | null = null;

  if (aqResult.status === "fulfilled") {
    airQuality = aqResult.value;
  } else {
    errors.push(`Air quality fetch failed: ${aqResult.reason}`);
  }

  if (weatherResult.status === "fulfilled") {
    weather = weatherResult.value;
  } else {
    errors.push(`Weather fetch failed: ${weatherResult.reason}`);
  }

  return { airQuality, weather, errors };
}
