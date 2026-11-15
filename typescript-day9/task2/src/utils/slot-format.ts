import { AvailabilityResponse, InquiryResponse } from "../types/reservation";

export function formatAvailability(res: AvailabilityResponse): string {
  const available = res.slots.filter((s) => s.status === "available");
  const confirmed = res.slots.filter((s) => s.status === "confirmed");
  const unavailable = res.slots.filter((s) => s.status === "unavailable");

  let out = `Availability for ${res.date}\n`;

  if (res.slots.length === 0 || available.length === 0) {
    out += `No availability.\n`;
  } else {
    out += `Available slots:\n`;
    available.forEach((s) => {
      out += `- ${s.time} (id: ${s.id})\n`;
    });
  }

  if (confirmed.length > 0) {
    out += `Confirmed slots:\n`;
    confirmed.forEach((s) => {
      out += `- ${s.time} (id: ${s.id})\n`;
    });
  }

  if (unavailable.length > 0) {
    out += `Unavailable slots:\n`;
    unavailable.forEach((s) => {
      out += `- ${s.time} (id: ${s.id})\n`;
    });
  }

  return out.trim();
}

export function formatInquiry(res: InquiryResponse): string {
  const status = res.confirmed
    ? "CONFIRMED BOOKING"
    : "INQUIRY SUBMITTED (not a confirmed booking)";
  return `Status: ${status}\nReference: ${res.inquiryId}\nMessage: ${res.message}`;
}
