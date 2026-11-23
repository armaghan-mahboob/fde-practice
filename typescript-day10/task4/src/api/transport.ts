import { env } from "../config/env";
import { MeterReading, ReadingListSchema } from "../schemas/meter.schema";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export async function fetchMeterReadings(
  meterId: string,
): Promise<MeterReading[]> {
  if (env.OFFLINE_MODE || !env.METER_API_KEY) {
    return simulateMeterReadings(meterId);
  }

  let response: Response;
  try {
    response = await fetch(
      `https://api.example.com/meters/${meterId}/readings`,
      {
        headers: { Authorization: `Bearer ${env.METER_API_KEY}` },
      },
    );
  } catch (error) {
    throw new Error(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  if (!response.ok) {
    throw new HttpError(
      response.status,
      `HTTP error! status: ${response.status}`,
    );
  }

  let rawData: unknown;
  try {
    rawData = await response.json();
  } catch (error) {
    throw new Error("Malformed JSON response from server");
  }

  const parseResult = ReadingListSchema.safeParse(rawData);
  if (!parseResult.success) {
    throw new Error(`Validation failed: ${parseResult.error.message}`);
  }

  return parseResult.data;
}

function simulateMeterReadings(meterId: string): MeterReading[] {
  if (meterId === "meter-UNKNOWN") {
    throw new HttpError(404, "Meter not found");
  }

  if (meterId === "meter-EMPTY") {
    return [];
  }

  if (meterId === "meter-MTR-DECREASE") {
    return [
      {
        meterId: meterId,
        timestamp: "2026-11-01T08:00:00Z",
        cumulativeKwh: 1057.9,
      },
      {
        meterId: meterId,
        timestamp: "2026-11-01T09:00:00Z",
        cumulativeKwh: 1052.4,
      },
    ];
  }

  return [
    {
      meterId: meterId,
      timestamp: "2026-11-01T08:00:00Z",
      cumulativeKwh: 1052.4,
    },
    {
      meterId: meterId,
      timestamp: "2026-11-01T12:00:00Z",
      cumulativeKwh: 1057.9,
    },
  ];
}
