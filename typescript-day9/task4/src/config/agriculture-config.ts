import { SensorConfig } from "../types/sensor";

export function loadConfig(): SensorConfig[] {
  const rawSensors = process.env.AGRICULTURE_SENSORS;

  if (rawSensors) {
    try {
      const parsed = JSON.parse(rawSensors);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      throw new Error("Invalid AGRICULTURE_SENSORS configuration format");
    }
  }

  return [
    { id: "sensor-1", apiEndpoint: "https://api.example.com/sensor/1" },
    { id: "sensor-2", apiEndpoint: "https://api.example.com/sensor/2" },
  ];
}
