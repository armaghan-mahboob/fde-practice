// OFFLINE_MODE=true npx tsx src/index.ts meter-MTR-204
// OFFLINE_MODE=true npx tsx src/index.ts meter-MTR-204 meter-UNKNOWN
// OFFLINE_MODE=true npx tsx src/index.ts meter-EMPTY
// OFFLINE_MODE=true npx tsx src/index.ts meter-MTR-DECREASE
// OFFLINE_MODE=true npx tsx src/index.ts meter-MTR-204 meter-MTR-205

import "./config/env";
import { getAllReadings } from "./services/reader.service";
import { calculateSummaries } from "./domain/energy-calculator";
import { generateReport } from "./report/index";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Please provide meter IDs.");
    console.log("Usage: npx tsx src/index.ts <meterId1> <meterId2> ...");
    process.exit(1);
  }

  const meterIds = args;

  try {
    const results = await getAllReadings(meterIds);
    const summaries = calculateSummaries(results);
    const report = generateReport(meterIds, summaries);
    console.log(report);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Fatal error: ${error.message}`);
    } else {
      console.error("An unknown error occurred.");
    }
    process.exit(1);
  }
}

main();
