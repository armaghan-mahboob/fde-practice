interface Traveler {
  id: number;
  fullName: string;
  email: string;
  passportNumber: string;
  preferredLanguage: string;
  accessibilityNotes?: string;
}

type TravelerPartial = Partial<Traveler>;
type TravelerRequired = Required<Traveler>;
type BookingConfiguration = Readonly<Traveler>;
type PublicTravelerProfile = Pick<
  Traveler,
  "id" | "fullName" | "preferredLanguage"
>;
type PublicFacingContract = Omit<Traveler, "passportNumber">;

type Destination = "Paris" | "Tokyo" | "New York" | "London";
type DestinationConfiguration = Record<
  Destination,
  { currency: string; visaRequired: boolean }
>;

type MandatoryAccessibility = NonNullable<Traveler["accessibilityNotes"]>;

function updateTravelerProfile(
  current: Traveler,
  update: TravelerPartial,
): Traveler {
  return { ...current, ...update };
}

const travelerInput = {
  id: 101,
  fullName: "Amina Rahman",
  email: "amina@example.com",
  passportNumber: "P-000000",
  preferredLanguage: "English",
  accessibilityNotes: "Aisle seat",
};

const completeTraveler: Traveler = travelerInput;

const partialUpdate: TravelerPartial = {
  preferredLanguage: "Spanish",
  accessibilityNotes: "Window seat",
};

const publicProfile: PublicTravelerProfile = {
  id: completeTraveler.id,
  fullName: completeTraveler.fullName,
  preferredLanguage: completeTraveler.preferredLanguage,
};

const destinationSettings: DestinationConfiguration = {
  Paris: { currency: "EUR", visaRequired: false },
  Tokyo: { currency: "JPY", visaRequired: false },
  "New York": { currency: "USD", visaRequired: true },
  London: { currency: "GBP", visaRequired: true },
};

const runtimePublicProfile: PublicFacingContract = {
  id: completeTraveler.id,
  fullName: completeTraveler.fullName,
  email: completeTraveler.email,
  preferredLanguage: completeTraveler.preferredLanguage,
  accessibilityNotes: completeTraveler.accessibilityNotes,
};

const validatedAccessibility: MandatoryAccessibility = "Wheelchair accessible";

// Expected compiler error: Property 'passportNumber' is missing in type '{ id: number; fullName: string; email: string; preferredLanguage: string; }' but required in type 'Required<Traveler>'.
const invalidRegistration: TravelerRequired = {
  id: 102,
  fullName: "John Doe",
  email: "john@example.com",
  preferredLanguage: "French",
};

// Expected compiler error: Object literal may only specify known properties, and 'passportNumber' does not exist in type 'PublicTravelerProfile'.
const invalidPublicProfile: PublicTravelerProfile = {
  id: 101,
  fullName: "Amina Rahman",
  preferredLanguage: "English",
  passportNumber: "P-000000",
};

const updatedTraveler = updateTravelerProfile(completeTraveler, partialUpdate);

console.log("Complete Traveler:", completeTraveler);
console.log("Updated Traveler:", updatedTraveler);
console.log("Runtime Public Profile:", runtimePublicProfile);
console.log("Destination Settings:", destinationSettings);
