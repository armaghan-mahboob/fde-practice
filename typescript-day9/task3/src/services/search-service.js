import { fetchFromProvider } from "./resource-api";
export async function searchResources(providers, params) {
    const promises = providers.map(async (provider) => {
        try {
            const resources = await fetchFromProvider(provider, params.term, params.category);
            return { provider: provider.name, resources };
        }
        catch (error) {
            return {
                provider: provider.name,
                resources: [],
                error: error.message,
            };
        }
    });
    return Promise.all(promises);
}
export async function searchProvidersSettled(providers, params) {
    const promises = providers.map(async (provider) => {
        try {
            const resources = await fetchFromProvider(provider, params.term, params.category);
            return { provider: provider.name, resources };
        }
        catch (error) {
            return {
                provider: provider.name,
                resources: [],
                error: error.message,
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
