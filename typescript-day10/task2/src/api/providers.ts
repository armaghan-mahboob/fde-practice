import {
  AirQualityData,
  WeatherData,
  AirQualityResponseSchema,
  WeatherResponseSchema,
} from "../schemas/airQuality.schema";
import { env } from "../config/env";

export async function fetchAirQuality(
  location: string,
): Promise<AirQualityData> {
  let source = "Local Simulation";
  let rawData: unknown;

  if (!env.AIR_QUALITY_API_KEY || env.OFFLINE_MODE) {
    rawData = simulateAirQuality(location);
  } else {
    try {
      const response = await fetch(
        `https://api.example.com/air-quality?location=${encodeURIComponent(location)}`,
        {
          headers: { Authorization: `Bearer ${env.AIR_QUALITY_API_KEY}` },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      rawData = await response.json();
      source = "External API";
    } catch (error) {
      rawData = simulateAirQuality(location);
    }
  }

  const parsed = AirQualityResponseSchema.parse(rawData);
  return { ...parsed, source };
}

export async function fetchWeather(location: string): Promise<WeatherData> {
  let source = "Local Simulation";
  let rawData: unknown;

  if (!env.WEATHER_API_KEY || env.OFFLINE_MODE) {
    rawData = simulateWeather(location);
  } else {
    try {
      const response = await fetch(
        `https://api.example.com/weather?location=${encodeURIComponent(location)}`,
        {
          headers: { Authorization: `Bearer ${env.WEATHER_API_KEY}` },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      rawData = await response.json();
      source = "External API";
    } catch (error) {
      rawData = simulateWeather(location);
    }
  }

  const parsed = WeatherResponseSchema.parse(rawData);
  return { ...parsed, source };
}

function simulateAirQuality(location: string): AirQualityData {
  return {
    station: `${location} Central Station`,
    observedAt: new Date().toISOString(),
    pm25: { value: 12.5, unit: "µg/m³" },
    no2: { value: 14.2, unit: "µg/m³" },
  };
}

function simulateWeather(location: string): WeatherData {
  return {
    temperatureCelsius: 22,
    humidityPercent: 65,
    condition: "Clear",
  };
}
