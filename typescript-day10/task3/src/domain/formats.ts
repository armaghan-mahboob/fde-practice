import { MarketReport } from "../services/rates.service";

export function formatReport(
  base: string,
  targets: string[],
  data: MarketReport,
): string {
  const lines: string[] = [];

  lines.push(`Financial Market Report`);
  lines.push("==================================================");
  lines.push(`Base Currency: ${base.toUpperCase()}`);
  lines.push(`Requested Targets: ${targets.join(", ")}`);

  if (data.unavailableTargets.length > 0) {
    lines.push(`Unavailable Targets: ${data.unavailableTargets.join(", ")}`);
  } else {
    lines.push(`Unavailable Targets: None`);
  }

  lines.push("--------------------------------------------------");
  lines.push("CURRENT RATES");

  if (data.currentRates) {
    lines.push(`Date: ${data.currentRates.date}`);
    targets.forEach((t) => {
      const rate = data.currentRates?.rates[t.toUpperCase()];
      if (rate) {
        lines.push(`  ${t.toUpperCase()}: ${rate}`);
      } else {
        lines.push(`  ${t.toUpperCase()}: Not supplied`);
      }
    });
  } else {
    lines.push("  Unavailable");
  }

  lines.push("--------------------------------------------------");
  lines.push("HISTORICAL RATES (Optional)");

  if (data.historicalRates) {
    lines.push(`Date: ${data.historicalRates.date}`);
    targets.forEach((t) => {
      const rate = data.historicalRates?.rates[t.toUpperCase()];
      if (rate) {
        lines.push(`  ${t.toUpperCase()}: ${rate}`);
      } else {
        lines.push(`  ${t.toUpperCase()}: Not supplied`);
      }
    });
  } else {
    lines.push("  Status: Not provided by source");
  }

  if (data.errors.length > 0) {
    lines.push("--------------------------------------------------");
    lines.push("WARNINGS / ERRORS");
    data.errors.forEach((err) => lines.push(` - ${err}`));
  }

  return lines.join("\n");
}
