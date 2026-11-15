import { SensorConfig, RawSensorReading } from "../types/sensor";
import { validateReading } from "../validation/sensor-validator";

export async function fetchSensorReading(
  config: SensorConfig,
): Promise<import("../types/sensor").ValidatedReading> {
  const url = new URL(config.apiEndpoint);
  if (config.apiKey) {
    url.searchParams.append("apiKey", config.apiKey);
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), { method: "GET" });
  } catch (error) {
    throw new Error(`Network failure: ${(error as Error).message}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new Error("Malformed response: unable to parse JSON");
  }

  return validateReading(json);
}
