import { ReservationRequest } from "../types/reservation";

export function validateRequest(req: unknown): ReservationRequest {
  if (typeof req !== "object" || req === null) {
    throw new Error("Invalid request: not an object");
  }

  const r = req as Record<string, unknown>;

  if (typeof r.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(r.date)) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD");
  }
  if (isNaN(Date.parse(r.date))) {
    throw new Error("Invalid date value");
  }

  if (typeof r.time !== "string" || !/^\d{2}:\d{2}$/.test(r.time)) {
    throw new Error("Invalid time format. Expected HH:MM");
  }

  if (
    typeof r.partySize !== "number" ||
    !Number.isInteger(r.partySize) ||
    r.partySize <= 0
  ) {
    throw new Error("Invalid party size. Must be a positive integer");
  }

  return {
    date: r.date,
    time: r.time,
    partySize: r.partySize,
  };
}

export function validateSlots(
  data: unknown,
): import("../types/reservation").AvailabilityResponse {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid response: not an object");
  }

  const raw = data as Record<string, unknown>;

  if (typeof raw.date !== "string" || !Array.isArray(raw.slots)) {
    throw new Error("Invalid payload: missing date or slots array");
  }

  const slots = raw.slots.map((s, i) => {
    if (typeof s !== "object" || s === null) {
      throw new Error(`Invalid slot at index ${i}`);
    }
    const slot = s as Record<string, unknown>;
    if (typeof slot.id !== "string" || typeof slot.time !== "string") {
      throw new Error(`Invalid slot shape at index ${i}`);
    }
    if (
      slot.status !== "available" &&
      slot.status !== "unavailable" &&
      slot.status !== "confirmed"
    ) {
      throw new Error(`Invalid slot status at index ${i}`);
    }
    return {
      id: slot.id,
      time: slot.time,
      status: slot.status as "available" | "unavailable" | "confirmed",
    };
  });

  return { date: raw.date, slots };
}

export function validateInquiry(
  data: unknown,
): import("../types/reservation").InquiryResponse {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid response: not an object");
  }

  const raw = data as Record<string, unknown>;

  if (typeof raw.inquiryId !== "string") {
    throw new Error("Invalid payload: missing inquiryId");
  }
  if (typeof raw.confirmed !== "boolean") {
    throw new Error("Invalid payload: confirmed must be boolean");
  }
  if (typeof raw.message !== "string") {
    throw new Error("Invalid payload: missing message");
  }

  return {
    inquiryId: raw.inquiryId,
    confirmed: raw.confirmed,
    message: raw.message,
  };
}
