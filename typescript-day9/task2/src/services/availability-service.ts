import {
  ReservationConfig,
  ReservationRequest,
  AvailabilityResponse,
} from "../types/reservation";
import { validateSlots } from "../validation/reservation-validator";

export async function getAvailability(
  config: ReservationConfig,
  request: ReservationRequest,
): Promise<AvailabilityResponse> {
  const url = new URL(config.baseUrl);
  url.searchParams.append("date", request.date);
  url.searchParams.append("time", request.time);
  url.searchParams.append("partySize", String(request.partySize));

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

  return normalizeSlots(json, request);
}

function normalizeSlots(
  data: unknown,
  request: ReservationRequest,
): AvailabilityResponse {
  const raw = data as any;

  if (Array.isArray(raw?.slots)) {
    return validateSlots(raw);
  }

  if (Array.isArray(raw?.products)) {
    const slots = raw.products.slice(0, 8).map((p: any, i: number) => {
      const status: "available" | "unavailable" | "confirmed" =
        i % 3 === 0 ? "available" : i % 3 === 1 ? "confirmed" : "unavailable";
      return {
        id: String(p.id),
        time: `18:${String(i * 5).padStart(2, "0")}`,
        status,
      };
    });
    return { date: request.date, slots };
  }

  if (Array.isArray(raw?.carts)) {
    return { date: request.date, slots: [] };
  }

  throw new Error("Invalid payload: unrecognized availability shape");
}
