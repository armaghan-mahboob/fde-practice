import { SensorResult, Recommendation } from "../types/sensor";

export function formatReport(
  results: SensorResult[],
  recommendations: Map<string, Recommendation>,
  useAllSettled: boolean,
): string {
  let output = "--- Smart Agriculture Monitoring Report ---\n\n";
  let hasFailure = false;

  for (const result of results) {
    if (result.error) {
      hasFailure = true;
      output += `[Sensor: ${result.sensorId}]\n`;
      output += `  ERROR: Failed to retrieve reading (${result.error})\n\n`;
      continue;
    }

    if (result.reading) {
      const rec = recommendations.get(result.sensorId);
      if (rec) {
        output += `[Field: ${rec.fieldId}] (Sensor: ${result.sensorId})\n`;
        output += `  Moisture: ${result.reading.soilMoisture}%\n`;
        output += `  ACTION: ${rec.action}\n`;
        output += `  REASON: ${rec.reason}\n\n`;
      }
    }
  }

  if (hasFailure) {
    output += useAllSettled
      ? `NOTE: Partial sensor failure detected. Report generated using available data via Promise.allSettled.\n`
      : `NOTE: Strict mode (Promise.all) failed due to a sensor error. Partial results not guaranteed.\n`;
  }

  output += "--- End of Report (Advice Only, No Equipment Control Issued) ---";
  return output;
}
