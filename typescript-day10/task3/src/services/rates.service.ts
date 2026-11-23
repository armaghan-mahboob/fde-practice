import { fetchJson } from "../api/http";
import { RateSchema, RateData } from "../schemas/rates.schema";
import { env } from "../config/env";

export interface MarketReport {
  currentRates: RateData | null;
  historicalRates: RateData | null;
  errors: string[];
  unavailableTargets: string[];
}

export async function getMarketData(
  base: string,
  targets: string[],
): Promise<MarketReport> {
  const errors: string[] = [];
  const unavailableTargets: string[] = [];
  const baseUpper = base.toUpperCase();

  let currentRates: RateData | null = null;
  let historicalRates: RateData | null = null;

  if (env.OFFLINE_MODE) {
    const rawCurrent = getOfflineCurrentRates(baseUpper);
    const rawHistorical = getOfflineHistoricalRates(baseUpper);

    const parseCurrent = RateSchema.safeParse(rawCurrent);
    if (parseCurrent.success) {
      currentRates = parseCurrent.data;
    } else {
      errors.push(
        `Current rates validation failed: ${parseCurrent.error.message}`,
      );
    }

    const parseHistorical = RateSchema.safeParse(rawHistorical);
    if (parseHistorical.success) {
      historicalRates = parseHistorical.data;
    } else {
      errors.push(
        `Historical rates validation failed: ${parseHistorical.error.message}`,
      );
    }
  } else {
    const currentUrl = `https://api.frankfurter.app/latest?from=${baseUpper}`;
    const historicalUrl = `https://api.frankfurter.app/2026-11-12?from=${baseUpper}`;

    const results = await Promise.allSettled([
      fetchJson<unknown>(currentUrl),
      fetchJson<unknown>(historicalUrl),
    ]);

    const [currentResult, historicalResult] = results;

    if (currentResult.status === "fulfilled") {
      const parsed = RateSchema.safeParse(currentResult.value);
      if (parsed.success) {
        currentRates = parsed.data;
      } else {
        errors.push(`Current rates validation failed: ${parsed.error.message}`);
      }
    } else {
      errors.push(`Current rates fetch failed: ${currentResult.reason}`);
    }

    if (historicalResult.status === "fulfilled") {
      const parsed = RateSchema.safeParse(historicalResult.value);
      if (parsed.success) {
        historicalRates = parsed.data;
      } else {
        errors.push(
          `Historical rates validation failed: ${parsed.error.message}`,
        );
      }
    } else {
      errors.push(`Historical rates fetch failed: ${historicalResult.reason}`);
    }
  }

  const availableTargets = new Set<string>();
  if (currentRates) {
    Object.keys(currentRates.rates).forEach((k) => availableTargets.add(k));
  }
  if (historicalRates) {
    Object.keys(historicalRates.rates).forEach((k) => availableTargets.add(k));
  }

  targets.forEach((target) => {
    const targetUpper = target.toUpperCase();
    if (!availableTargets.has(targetUpper)) {
      unavailableTargets.push(targetUpper);
    }
  });

  return { currentRates, historicalRates, errors, unavailableTargets };
}

function getOfflineCurrentRates(base: string): unknown {
  return {
    amount: 1.0,
    base: base,
    date: "2026-11-23",
    rates: {
      USD: 1.08,
      GBP: 0.86,
      JPY: 164.2,
    },
  };
}

function getOfflineHistoricalRates(base: string): unknown {
  return {
    amount: 1.0,
    base: base,
    date: "2026-11-12",
    rates: {
      USD: 1.07,
      GBP: 0.85,
      // JPY intentionally missing to test partial reporting
    },
  };
}
