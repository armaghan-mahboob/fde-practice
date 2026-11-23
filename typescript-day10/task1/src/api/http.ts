import { API_KEY } from "../config";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export async function fetchJson<T>(url: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
  } catch (error) {
    throw new Error(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  if (response.status === 404) {
    throw new HttpError(404, "Country not found");
  }

  if (!response.ok) {
    throw new HttpError(
      response.status,
      `HTTP error! status: ${response.status}`,
    );
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new Error("Malformed JSON response from server");
  }
}
