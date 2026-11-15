/*
# 1. Test Blank Search Term Rejection (Should throw an error)
tsx src/index.ts --term=""

# 2. Test Fixture Mode (No provider configured, uses local mock data)
tsx src/index.ts --fixture --term="TypeScript"

# 3. Test Fixture Mode with Category Filter
tsx src/index.ts --fixture --term="TypeScript" --category="Programming"

# 4. Test Special Characters Encoding (Runs fixture, but tests the URLSearchParams logic)
tsx src/index.ts --fixture --term="C++ & Rust"

# 5. Test "No Provider Configured" Behavior (Without fixture)
tsx src/index.ts --term="TypeScript"
*/

import { ProviderConfig, ProviderResult } from "./types/resource";
import {
  validateSearchParams,
  validateResourceList,
} from "./validation/resource-validator";
import { searchProvidersSettled } from "./services/search-service";
import { formatSearchResults } from "./utils/resource-format";

declare const process: {
  env: { [key: string]: string | undefined };
  argv: string[];
  exit: (code: number) => never;
};

const RAW_FIXTURE_RESOURCES = [
  {
    id: "1",
    title: "TypeScript Deep Dive",
    category: "Programming",
    url: "https://example.com/ts-deep-dive",
  },
  {
    id: "2",
    title: "Advanced TypeScript Concepts",
    category: "Programming",
    url: "https://example.com/advanced-ts",
  },
  {
    id: "3",
    title: "Malformed Record Missing URL",
    category: "Programming",
  },
];

function getArg(args: string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  const match = args.find((a) => a.startsWith(prefix));
  if (match === undefined) return undefined;
  return match.slice(prefix.length);
}

async function main() {
  const args = process.argv.slice(2);
  const useFixture = args.includes("--fixture");

  try {
    const rawParams = {
      term: getArg(args, "term") ?? "TypeScript",
      category: getArg(args, "category"),
    };

    const validParams = validateSearchParams(rawParams);

    if (useFixture) {
      const safeResources = validateResourceList(RAW_FIXTURE_RESOURCES);
      const fixtureResult: ProviderResult = {
        provider: "Local Fixture",
        resources: safeResources,
      };
      console.log(formatSearchResults([fixtureResult], validParams.term));
      return;
    }

    const providers: ProviderConfig[] = [];

    if (process.env.PROVIDER_BASE_URL) {
      providers.push({
        name: "Remote Provider",
        baseUrl: process.env.PROVIDER_BASE_URL,
        apiKey: process.env.PROVIDER_API_KEY,
      });
    }

    if (providers.length === 0) {
      console.log(
        "No providers configured. Run with --fixture for local demonstration.",
      );
      return;
    }

    const results = await searchProvidersSettled(providers, validParams);
    console.log(formatSearchResults(results, validParams.term));
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
