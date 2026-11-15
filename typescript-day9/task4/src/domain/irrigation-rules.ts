import { ValidatedReading, Recommendation } from "../types/sensor";

// Documented moisture thresholds
const MOISTURE_CRITICAL_THRESHOLD = 20; // Below this requires irrigation
const MOISTURE_TARGET_THRESHOLD = 40; // Above this is sufficient
const STALE_READING_LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateRecommendation(
  reading: ValidatedReading,
  now: number = Date.now(),
): Recommendation {
  const isStale = now - reading.timestamp > STALE_READING_LIMIT_MS;

  if (isStale) {
    return {
      fieldId: reading.fieldId,
      action: "UNKNOWN",
      reason: `Reading is stale (older than 24 hours). Last reading: ${new Date(reading.timestamp).toISOString()}`,
    };
  }

  if (reading.soilMoisture < MOISTURE_CRITICAL_THRESHOLD) {
    return {
      fieldId: reading.fieldId,
      action: "IRRIGATE",
      reason: `Soil moisture (${reading.soilMoisture}%) is below the critical threshold of ${MOISTURE_CRITICAL_THRESHOLD}%.`,
    };
  }

  return {
    fieldId: reading.fieldId,
    action: "HOLD",
    reason: `Soil moisture (${reading.soilMoisture}%) is sufficient. Do not irrigate.`,
  };
}
