import { ValidatedWeather } from "../types/weather";

export function formatWeatherSummary(weather: ValidatedWeather): string {
  const { city, temperature, high, low, forecast } = weather;

  let summary = `Weather Dashboard for ${city}\n`;
  summary += `Current Temp: ${temperature}°C\n`;
  summary += `Daily High: ${high}°C / Daily Low: ${low}°C\n`;

  if (forecast.length > 0) {
    summary += `\nShort Forecast:\n`;
    forecast.forEach((f) => {
      summary += `- ${f.day}: High ${f.high}°C, Low ${f.low}°C\n`;
    });
  }

  return summary.trim();
}
