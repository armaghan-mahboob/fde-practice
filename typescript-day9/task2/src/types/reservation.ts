export interface ReservationConfig {
  baseUrl: string;
  apiKey?: string;
}

export interface ReservationRequest {
  date: string;
  time: string;
  partySize: number;
}

export interface Slot {
  id: string;
  time: string;
  status: "available" | "unavailable" | "confirmed";
}

export interface AvailabilityResponse {
  date: string;
  slots: Slot[];
}

export interface InquiryResponse {
  inquiryId: string;
  confirmed: boolean;
  message: string;
}
