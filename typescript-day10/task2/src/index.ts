// tsx src/index.ts "New York"

import "./config/env";
import { getEnvironmentData } from "./services/environment.service";
import { formatReport } from "./reports/report";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Please provide a location.");
    console.log("Usage: npx tsx src/index.ts <location>");
    process.exit(1);
  }

  const location = args.join(" ");

  try {
    const data = await getEnvironmentData(location);
    console.log(formatReport(location, data));
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
