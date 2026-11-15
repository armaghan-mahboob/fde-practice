import {
  ReservationConfig,
  ReservationRequest,
  InquiryResponse,
} from "../types/reservation";
import { validateInquiry } from "../validation/reservation-validator";

export async function submitInquiry(
  config: ReservationConfig,
  request: ReservationRequest,
  slotId: string,
): Promise<InquiryResponse> {
  const url = new URL(config.baseUrl);
  if (config.apiKey) {
    url.searchParams.append("apiKey", config.apiKey);
  }

  const body = {
    date: request.date,
    time: request.time,
    partySize: request.partySize,
    slotId,
  };

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
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

  return normalizeInquiry(json, slotId);
}

function normalizeInquiry(data: unknown, slotId: string): InquiryResponse {
  const raw = data as any;

  try {
    return validateInquiry(raw);
  } catch {
    const confirmed = raw?.confirmed === true || raw?.status === "confirmed";
    return {
      inquiryId: String(raw?.id ?? raw?.inquiryId ?? `inq-${slotId}`),
      confirmed,
      message: raw?.message ?? raw?.title ?? "Inquiry received.",
    };
  }
}
