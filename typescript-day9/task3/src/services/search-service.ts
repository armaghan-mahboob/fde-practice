import {
  ProviderConfig,
  ProviderResult,
  SearchParams,
} from "../types/resource";
import { fetchFromProvider } from "./resource-api";

export async function searchResources(
  providers: ProviderConfig[],
  params: SearchParams,
): Promise<ProviderResult[]> {
  const promises = providers.map(async (provider): Promise<ProviderResult> => {
    try {
      const resources = await fetchFromProvider(
        provider,
        params.term,
        params.category,
      );
      return { provider: provider.name, resources };
    } catch (error) {
      return {
        provider: provider.name,
        resources: [],
        error: (error as Error).message,
      };
    }
  });

  return Promise.all(promises);
}

export async function searchProvidersSettled(
  providers: ProviderConfig[],
  params: SearchParams,
): Promise<ProviderResult[]> {
  const promises = providers.map(async (provider) => {
    try {
      const resources = await fetchFromProvider(
        provider,
        params.term,
        params.category,
      );
      return { provider: provider.name, resources };
    } catch (error) {
      return {
        provider: provider.name,
        resources: [],
        error: (error as Error).message,
      };
    }
  });

  const results = await Promise.allSettled(promises);

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      provider: providers[index].name,
      resources: [],
      error: "Unknown rejection",
    };
  });
}
