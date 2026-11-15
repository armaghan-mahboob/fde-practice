import { ProviderConfig, Resource } from "../types/resource";
import { validateResourceList } from "../validation/resource-validator";

export async function fetchFromProvider(
  config: ProviderConfig,
  term: string,
  category?: string,
): Promise<Resource[]> {
  const url = new URL(config.baseUrl);
  url.searchParams.append("q", term);
  if (category) {
    url.searchParams.append("category", category);
  }
  if (config.apiKey) {
    url.searchParams.append("apiKey", config.apiKey);
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), { method: "GET" });
  } catch (error) {
    throw new Error(`Network failure: ${(error as Error).message}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new Error("Malformed response: unable to parse JSON");
  }

  const payload = Array.isArray(json)
    ? json
    : (json as any)?.results || (json as any)?.items;
  return validateResourceList(payload);
}
