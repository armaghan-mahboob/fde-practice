import { fetchMeterReadings } from "../api/transport";
import { MeterReading } from "../schemas/meter.schema";

export interface SourceResult {
  meterId: string;
  readings: MeterReading[] | null;
  error: string | null;
}

export async function getAllReadings(
  meterIds: string[],
): Promise<SourceResult[]> {
  const promises = meterIds.map(async (id): Promise<SourceResult> => {
    try {
      const readings = await fetchMeterReadings(id);
      return { meterId: id, readings, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { meterId: id, readings: null, error: message };
    }
  });

  return Promise.all(promises);
}
