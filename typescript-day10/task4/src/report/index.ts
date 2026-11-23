import { MeterSummary } from "../domain/energy-calculator";

export function generateReport(
  meterIds: string[],
  summaries: MeterSummary[],
): string {
  const lines: string[] = [];

  lines.push("Energy Consumption Report");
  lines.push("==================================================");
  lines.push(`Requested Meters: ${meterIds.join(", ")}`);
  lines.push("--------------------------------------------------");

  let totalDaily = 0;
  const rejected: string[] = [];
  const warnings: string[] = [];

  summaries.forEach((summary) => {
    lines.push(`Meter ID: ${summary.meterId}`);
    lines.push(`Status:   ${summary.status}`);

    if (summary.status !== "OK") {
      if (summary.status === "Rejected") {
        rejected.push(summary.meterId);
      }
      if (summary.message) {
        warnings.push(`${summary.meterId}: ${summary.message}`);
      }
    } else {
      if (summary.latestReading) {
        lines.push(`Latest Timestamp: ${summary.latestReading.timestamp}`);
        lines.push(
          `Latest Reading:   ${summary.latestReading.cumulativeKwh} kWh`,
        );
      }

      if (summary.intervalUsage !== null) {
        lines.push(`Interval Usage:   ${summary.intervalUsage.toFixed(2)} kWh`);
      } else {
        lines.push(`Interval Usage:   Not supplied`);
      }

      if (summary.dailyTotal !== null) {
        lines.push(`Daily Total:      ${summary.dailyTotal.toFixed(2)} kWh`);
        totalDaily += summary.dailyTotal;
      } else {
        lines.push(`Daily Total:      Not supplied`);
      }

      if (summary.monthlyTotal !== null) {
        lines.push(`Monthly Total:    ${summary.monthlyTotal.toFixed(2)} kWh`);
      } else {
        lines.push(`Monthly Total:    Not supplied`);
      }
    }

    lines.push("--------------------------------------------------");
  });

  lines.push(
    `Total Daily Consumption (Valid Meters): ${totalDaily.toFixed(2)} kWh`,
  );
  lines.push(
    `Rejected Records: ${rejected.length > 0 ? rejected.join(", ") : "None"}`,
  );

  if (warnings.length > 0) {
    lines.push("Warnings / Errors:");
    warnings.forEach((w) => lines.push(` - ${w}`));
  } else {
    lines.push("Warnings / Errors: None");
  }

  return lines.join("\n");
}
