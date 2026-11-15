import { RawSensorReading, ValidatedReading } from "../types/sensor";

export function validateReading(data: unknown): ValidatedReading {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid reading: not an object");
  }

  const raw = data as Record<string, unknown>;

  if (typeof raw.fieldId !== "string" || raw.fieldId.trim().length === 0) {
    throw new Error("Invalid fieldId");
  }

  let timestamp: number;
  if (typeof raw.timestamp === "string") {
    timestamp = Date.parse(raw.timestamp);
  } else if (typeof raw.timestamp === "number") {
    timestamp = raw.timestamp;
  } else {
    throw new Error("Invalid timestamp");
  }

  if (isNaN(timestamp)) {
    throw new Error("Invalid timestamp value");
  }

  if (
    typeof raw.soilMoisture !== "number" ||
    raw.soilMoisture < 0 ||
    raw.soilMoisture > 100
  ) {
    throw new Error("Invalid soilMoisture: out of range (0-100)");
  }

  let temperature: number | undefined;
  if (raw.temperature !== undefined) {
    if (
      typeof raw.temperature !== "number" ||
      raw.temperature < -50 ||
      raw.temperature > 60
    ) {
      throw new Error("Invalid temperature: out of range (-50 to 60)");
    }
    temperature = raw.temperature;
  }

  return {
    fieldId: raw.fieldId,
    timestamp,
    soilMoisture: raw.soilMoisture,
    temperature,
  };
}
