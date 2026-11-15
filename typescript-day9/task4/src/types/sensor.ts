export interface SensorConfig {
  id: string;
  apiEndpoint: string;
  apiKey?: string;
}

export interface RawSensorReading {
  fieldId: string;
  timestamp: string | number;
  soilMoisture: number;
  temperature?: number;
}

export interface ValidatedReading {
  fieldId: string;
  timestamp: number;
  soilMoisture: number;
  temperature?: number;
}

export interface SensorResult {
  sensorId: string;
  reading?: ValidatedReading;
  error?: string;
}

export interface Recommendation {
  fieldId: string;
  action: "IRRIGATE" | "HOLD" | "UNKNOWN";
  reason: string;
}
