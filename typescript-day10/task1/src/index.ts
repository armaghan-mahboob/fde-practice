// tsx src/index.ts Japan

import { searchCountry } from "./services/country.service";
import { formatCountryReport } from "./presentation/report";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Please provide a country name or code.");
    console.log("Usage: tsx src/index.ts <country_name>");
    process.exit(1);
  }

  const query = args.join(" ");

  try {
    const country = await searchCountry(query);

    if (!country) {
      console.log(`No country found matching "${query}".`);
      return;
    }

    console.log(formatCountryReport(country));
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unknown error occurred.");
    }
    process.exit(1);
  }
}

main();
