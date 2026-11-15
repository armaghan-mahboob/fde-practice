import { WeatherConfig } from "../types/weather";

export async function fetchWeather(config: WeatherConfig): Promise<unknown> {
  if (!config.apiKey) {
    throw new Error(
      "Missing API Key. Set WEATHER_API_KEY environment variable.",
    );
  }

  const url = new URL(config.apiEndpoint);
  url.searchParams.append("q", config.city);
  url.searchParams.append("appid", config.apiKey);
  url.searchParams.append("units", "metric");

  let response: Response;
  try {
    response = await fetch(url.toString(), { method: "GET" });
  } catch (error) {
    throw new Error(`Network failure: ${(error as Error).message}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}
