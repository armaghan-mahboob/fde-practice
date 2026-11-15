export interface WeatherConfig {
  city: string;
  apiEndpoint: string;
  apiKey?: string;
}

export interface ValidatedWeather {
  city: string;
  temperature: number;
  high: number;
  low: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
  }>;
}
