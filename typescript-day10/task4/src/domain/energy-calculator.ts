import { MeterReading } from "../schemas/meter.schema";
import { SourceResult } from "../services/reader.service";

export interface MeterSummary {
  meterId: string;
  latestReading: MeterReading | null;
  intervalUsage: number | null;
  dailyTotal: number | null;
  monthlyTotal: number | null;
  status: "OK" | "Error" | "Rejected";
  message: string | null;
}

export function calculateSummaries(results: SourceResult[]): MeterSummary[] {
  return results.map((result) => {
    if (result.error || !result.readings) {
      return {
        meterId: result.meterId,
        latestReading: null,
        intervalUsage: null,
        dailyTotal: null,
        monthlyTotal: null,
        status: "Error",
        message: result.error || "No readings available",
      };
    }

    const readings = result.readings;
    if (readings.length === 0) {
      return {
        meterId: result.meterId,
        latestReading: null,
        intervalUsage: null,
        dailyTotal: null,
        monthlyTotal: null,
        status: "Error",
        message: "Empty readings list",
      };
    }

    const sorted = [...readings].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].cumulativeKwh < sorted[i - 1].cumulativeKwh) {
        return {
          meterId: result.meterId,
          latestReading: sorted[sorted.length - 1],
          intervalUsage: null,
          dailyTotal: null,
          monthlyTotal: null,
          status: "Rejected",
          message: `Decreasing cumulative value detected at ${sorted[i].timestamp}`,
        };
      }
    }

    const latestReading = sorted[sorted.length - 1];
    let intervalUsage: number | null = null;
    let dailyTotal: number | null = null;
    let monthlyTotal: number | null = null;

    if (sorted.length >= 2) {
      const previous = sorted[sorted.length - 2];
      intervalUsage = latestReading.cumulativeKwh - previous.cumulativeKwh;
    }

    const latestDate = new Date(latestReading.timestamp);
    const sameDayReadings = sorted.filter((r) => {
      const d = new Date(r.timestamp);
      return (
        d.getUTCFullYear() === latestDate.getUTCFullYear() &&
        d.getUTCMonth() === latestDate.getUTCMonth() &&
        d.getUTCDate() === latestDate.getUTCDate()
      );
    });

    if (sameDayReadings.length >= 2) {
      const firstOfDay = sameDayReadings[0];
      dailyTotal = latestReading.cumulativeKwh - firstOfDay.cumulativeKwh;
    }

    if (sorted.length >= 2) {
      const firstOfMonth = sorted[0];
      monthlyTotal = latestReading.cumulativeKwh - firstOfMonth.cumulativeKwh;
    }

    return {
      meterId: result.meterId,
      latestReading,
      intervalUsage,
      dailyTotal,
      monthlyTotal,
      status: "OK",
      message: null,
    };
  });
}
