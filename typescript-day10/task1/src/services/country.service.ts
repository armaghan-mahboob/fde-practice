import { fetchJson, HttpError } from "../api/http";
import {
  CountrySearchResponseSchema,
  Country,
} from "../schemas/country.schema";
import { API_BASE_URL } from "../config";

export async function searchCountry(query: string): Promise<Country | null> {
  const url = `${API_BASE_URL}?q=${encodeURIComponent(query)}`;

  try {
    const rawData: unknown = await fetchJson<unknown>(url);

    const parseResult = CountrySearchResponseSchema.safeParse(rawData);

    if (!parseResult.success) {
      throw new Error(
        `Validation failed: ${JSON.stringify(parseResult.error.issues, null, 2)}`,
      );
    }

    const countries = parseResult.data.data.objects;

    if (countries.length === 0) {
      return null;
    }

    return countries[0];
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
