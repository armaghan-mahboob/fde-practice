import { validateResourceList } from "../validation/resource-validator";
export async function fetchFromProvider(config, term, category) {
    const url = new URL(config.baseUrl);
    url.searchParams.append("q", term);
    if (category) {
        url.searchParams.append("category", category);
    }
    if (config.apiKey) {
        url.searchParams.append("apiKey", config.apiKey);
    }
    let response;
    try {
        response = await fetch(url.toString(), { method: "GET" });
    }
    catch (error) {
        throw new Error(`Network failure: ${error.message}`);
    }
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let json;
    try {
        json = await response.json();
    }
    catch {
        throw new Error("Malformed response: unable to parse JSON");
    }
    const payload = Array.isArray(json)
        ? json
        : json?.results || json?.items;
    return validateResourceList(payload);
}
