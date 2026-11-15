/*
# 1. Run in fixture mode with Promise.allSettled (Graceful partial failure)
tsx src/index.ts --fixture

# 2. Run in fixture mode with Promise.all (Strict mode, fails on first error)
tsx src/index.ts --fixture --strict
*/

import { SensorConfig, SensorResult, Recommendation } from "./types/sensor";
import { loadConfig } from "./config/agriculture-config";
import { fetchSensorReading } from "./services/sensor-service";
import { generateRecommendation } from "./domain/irrigation-rules";
import { formatReport } from "./utils/report";

declare const process: {
  env: { [key: string]: string | undefined };
  argv: string[];
  exit: (code: number) => never;
};

const FIXTURE_CONFIGS: SensorConfig[] = [
  { id: "sensor-low", apiEndpoint: "fixture://low" },
  { id: "sensor-high", apiEndpoint: "fixture://high" },
  { id: "sensor-stale", apiEndpoint: "fixture://stale" },
  { id: "sensor-fail", apiEndpoint: "fixture://fail" },
];

const FIXTURE_DATA: Record<string, any> = {
  "fixture://low": {
    fieldId: "field-A",
    timestamp: Date.now(),
    soilMoisture: 15,
  },
  "fixture://high": {
    fieldId: "field-B",
    timestamp: Date.now(),
    soilMoisture: 65,
  },
  "fixture://stale": {
    fieldId: "field-C",
    timestamp: Date.now() - 48 * 60 * 60 * 1000,
    soilMoisture: 10,
  },
  "fixture://fail": null,
};

async function getFixtureReading(config: SensorConfig): Promise<any> {
  if (config.apiEndpoint === "fixture://fail") {
    throw new Error("Network timeout (Simulated)");
  }
  return FIXTURE_DATA[config.apiEndpoint];
}

async function main() {
  const args = process.argv.slice(2);
  const useFixture = args.includes("--fixture");
  const useStrict = args.includes("--strict");

  const configs = useFixture ? FIXTURE_CONFIGS : loadConfig();

  try {
    let results: SensorResult[] = [];

    if (useStrict) {
      const promises = configs.map(async (c) => {
        const reading = useFixture
          ? await getFixtureReading(c)
          : await fetchSensorReading(c);
        return { sensorId: c.id, reading };
      });
      const resolved = await Promise.all(promises);
      results = resolved;
    } else {
      const promises = configs.map(async (c) => {
        try {
          const reading = useFixture
            ? await getFixtureReading(c)
            : await fetchSensorReading(c);
          return { sensorId: c.id, reading };
        } catch (error) {
          return { sensorId: c.id, error: (error as Error).message };
        }
      });
      const settled = await Promise.allSettled(promises);

      results = settled.map((res, index) => {
        if (res.status === "fulfilled") {
          return res.value;
        }
        return {
          sensorId: configs[index].id,
          error: "Unknown promise rejection",
        };
      });
    }

    const recommendations = new Map<string, Recommendation>();

    for (const result of results) {
      if (result.reading) {
        recommendations.set(
          result.sensorId,
          generateRecommendation(result.reading),
        );
      }
    }

    console.log(formatReport(results, recommendations, !useStrict));
  } catch (error) {
    console.error(`Fatal Application Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
