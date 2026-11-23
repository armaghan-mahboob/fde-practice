import { EnvironmentReport } from "../services/environment.service";

export function formatReport(
  location: string,
  data: EnvironmentReport,
): string {
  const lines: string[] = [];

  lines.push(`Environmental Health Report for ${location}`);
  lines.push("==================================================");

  if (data.airQuality) {
    lines.push(`Station:      ${data.airQuality.station}`);
    lines.push(`Observed At:  ${data.airQuality.observedAt}`);
    lines.push(`Source:       ${data.airQuality.source}`);

    if (data.airQuality.pm25) {
      lines.push(
        `PM2.5:        ${data.airQuality.pm25.value} ${data.airQuality.pm25.unit}`,
      );
    } else {
      lines.push(`PM2.5:        Not supplied`);
    }

    if (data.airQuality.no2) {
      lines.push(
        `NO2:          ${data.airQuality.no2.value} ${data.airQuality.no2.unit}`,
      );
    } else {
      lines.push(`NO2:          Not supplied`);
    }
  } else {
    lines.push(`Air Quality:  Unavailable`);
  }

  lines.push("--------------------------------------------------");

  if (data.weather) {
    lines.push(`Temperature:  ${data.weather.temperatureCelsius}°C`);
    lines.push(`Humidity:     ${data.weather.humidityPercent}%`);
    lines.push(`Condition:    ${data.weather.condition}`);
    lines.push(`Source:       ${data.weather.source}`);
  } else {
    lines.push(`Weather:      Unavailable`);
  }

  if (data.errors.length > 0) {
    lines.push("--------------------------------------------------");
    lines.push("Warnings:");
    data.errors.forEach((err) => lines.push(` - ${err}`));
  }

  return lines.join("\n");
}
