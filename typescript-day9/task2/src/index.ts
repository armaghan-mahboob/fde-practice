/*
# 1. Empty availability
tsx src/index.ts --fixture-empty

# 2. Invalid response shape
tsx src/index.ts --fixture-invalid

# 3. Invalid party size (rejected before network)
tsx src/index.ts --invalid-party

# 4. Live call against DummyJSON (no API key needed)
tsx src/index.ts
*/

import { ReservationConfig, ReservationRequest } from "./types/reservation";
import { validateRequest } from "./validation/reservation-validator";
import { getAvailability } from "./services/availability-service";
import { submitInquiry } from "./services/inquiry-service";
import { formatAvailability, formatInquiry } from "./utils/slot-format";

declare const process: {
  env: { [key: string]: string | undefined };
  argv: string[];
  exit: (code: number) => never;
};

const FIXTURE_INVALID_RESPONSE = {
  date: "2026-11-20",
  slots: "this is not an array",
};

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0];

  const availabilityConfig: ReservationConfig = {
    baseUrl:
      process.env.RESERVATION_BASE_URL ||
      "https://dummyjson.com/products?limit=8",
  };

  const inquiryConfig: ReservationConfig = {
    baseUrl: "https://dummyjson.com/products/add",
  };

  const sampleRequest = {
    date: "2026-11-20",
    time: "18:30",
    partySize: 2,
  };

  try {
    if (mode === "--fixture-empty") {
      const validated = validateRequest(sampleRequest);
      console.log(formatAvailability({ date: validated.date, slots: [] }));
      return;
    }

    if (mode === "--fixture-invalid") {
      const validated = validateRequest(sampleRequest);
      const { validateSlots } =
        await import("./validation/reservation-validator");
      try {
        validateSlots(FIXTURE_INVALID_RESPONSE);
      } catch (err) {
        console.log(`Handled invalid response: ${(err as Error).message}`);
      }
      console.log(`Date requested: ${validated.date}`);
      return;
    }

    if (mode === "--invalid-party") {
      try {
        validateRequest({ ...sampleRequest, partySize: 0 });
      } catch (err) {
        console.log(`Rejected before network: ${(err as Error).message}`);
      }
      return;
    }

    const validated: ReservationRequest = validateRequest(sampleRequest);
    console.log(
      `Request validated: ${validated.date} ${validated.time}, party ${validated.partySize}`,
    );

    const availability = await getAvailability(availabilityConfig, validated);
    console.log(formatAvailability(availability));

    const chosen = availability.slots.find((s) => s.status === "available");
    if (!chosen) {
      console.log("No available slot to inquire about.");
      return;
    }

    console.log(`Selected slot: ${chosen.time} (id: ${chosen.id})`);

    const inquiry = await submitInquiry(inquiryConfig, validated, chosen.id);
    console.log(formatInquiry(inquiry));
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
