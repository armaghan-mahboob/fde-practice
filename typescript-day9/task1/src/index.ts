// use this path to run offline: tsx src/index.ts --fixture
// use this command to run live with your api key: WEATHER_CITY=Islamabad WEATHER_API_KEY=your_actual_key_here tsx src/index.ts

import { loadConfig } from "./config/weather-config";
import { fetchWeather } from "./services/weather-service";
import { validateWeather } from "./validation/weather-validator";
import { formatWeatherSummary } from "./utils/weather-format";

declare const process: {
  argv: string[];
  exit: (code: number) => never;
};

const FIXTURE_DATA = {
  name: "FixtureCity",
  main: {
    temp: 22,
    temp_max: 25,
    temp_min: 18,
  },
  forecast: [
    { day: "Monday", high: 23, low: 17 },
    { day: "Tuesday", high: 24, low: 16 },
  ],
};

async function main() {
  const args = process.argv.slice(2);
  const useFixture = args.includes("--fixture");

  try {
    let rawData: unknown;

    if (useFixture) {
      rawData = FIXTURE_DATA;
    } else {
      const config = loadConfig();
      rawData = await fetchWeather(config);
    }

    const validated = validateWeather(rawData);
    const formatted = formatWeatherSummary(validated);

    console.log(formatted);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
