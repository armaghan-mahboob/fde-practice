// tsx src/index.ts --base EUR --symbols USD,GBP,JPY

import "./config/env";
import { getMarketData } from "./services/rates.service";
import { formatReport } from "./domain/formats";

async function main() {
  const args = process.argv.slice(2);

  let base = "EUR";
  const targets: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--base" && i + 1 < args.length) {
      base = args[i + 1];
      i++;
    } else if (args[i] === "--symbols" && i + 1 < args.length) {
      targets.push(...args[i + 1].split(","));
      i++;
    }
  }

  if (targets.length === 0) {
    targets.push("USD", "GBP", "JPY");
  }

  try {
    const data = await getMarketData(base, targets);
    console.log(formatReport(base, targets, data));
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
