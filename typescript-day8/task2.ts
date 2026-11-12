interface BaseDevice {
  id: string;
  name: string;
}

interface SmartLight extends BaseDevice {
  room: string;
  brightness: number;
  enabled: boolean;
}

interface SmartThermostat extends BaseDevice {
  room: string;
  targetCelsius: number;
  mode: "eco" | "comfort" | "off";
}

interface SmartLock extends BaseDevice {
  isLocked: boolean;
  batteryPercentage: number;
}

type ReadonlyDevice<T> = {
  readonly [K in keyof T]: T[K];
};

type OptionalDevice<T> = {
  [K in keyof T]?: T[K];
};

type ValidationResult<T> = {
  [K in keyof T]: { value: T[K]; isValid: boolean; error?: string };
};

type DeviceProperty<T> = {
  [K in keyof T]: { key: K; value: T[K] };
}[keyof T];

type IsSmartLight<T> = T extends { brightness: number } ? true : false;

type PropertyClassification<T> = T extends string
  ? "text"
  : T extends number
    ? "numeric"
    : T extends boolean
      ? "toggle"
      : "complex";

type ValidatedLight = Required<SmartLight>;
type PartialLockUpdate = Partial<SmartLock>;
type ThermostatSummary = Pick<SmartThermostat, "id" | "name" | "targetCelsius">;

function validateDevice<T extends BaseDevice>(device: T): ValidationResult<T> {
  const result: any = {};
  for (const key in device) {
    result[key] = { value: device[key], isValid: true };
  }
  if ("brightness" in device) {
    const light = device as SmartLight;
    result.brightness.isValid =
      light.brightness >= 0 && light.brightness <= 100;
    if (!result.brightness.isValid) {
      result.brightness.error = "Brightness must be between 0 and 100";
    }
  }
  return result as ValidationResult<T>;
}

const lightInput = {
  id: "L-1",
  room: "Kitchen",
  brightness: 70,
  enabled: true,
};
const thermostatInput = {
  id: "T-2",
  room: "Hall",
  targetCelsius: 21,
  mode: "eco",
};

const myLight: SmartLight = { ...lightInput, name: "Kitchen Light" };
const myThermostat: SmartThermostat = {
  ...thermostatInput,
  name: "Hall Thermostat",
};
const myLock: SmartLock = {
  id: "LK-3",
  name: "Front Door",
  isLocked: true,
  batteryPercentage: 85,
};

const validLightConfig: ValidatedLight = myLight;
const partialLockUpdate: PartialLockUpdate = { isLocked: false };
const thermostatSummary: ThermostatSummary = {
  id: myThermostat.id,
  name: myThermostat.name,
  targetCelsius: myThermostat.targetCelsius,
};

const lightValidation = validateDevice(myLight);
const thermostatValidation = validateDevice(myThermostat);

const isLight: IsSmartLight<SmartLight> = true;
const isThermostatALight: IsSmartLight<SmartThermostat> = false;

const brightnessType: PropertyClassification<SmartLight["brightness"]> =
  "numeric";
const modeType: PropertyClassification<SmartThermostat["mode"]> = "text";
const enabledType: PropertyClassification<SmartLight["enabled"]> = "toggle";

const lightBrightnessProperty: DeviceProperty<SmartLight> = {
  key: "brightness",
  value: 70,
};

// Expected compiler error: Object literal may only specify known properties, and 'brightness' does not exist in type 'SmartThermostat'.
const invalidThermostat: SmartThermostat = {
  id: "T-4",
  name: "Bad Thermostat",
  room: "Living Room",
  targetCelsius: 22,
  mode: "eco",
  brightness: 50,
};

// Expected compiler error: Type 'string' is not assignable to type 'number'.
const invalidBrightness: ValidatedLight = {
  ...myLight,
  brightness: "high",
};

console.log("Light Validation:", lightValidation);
console.log("Thermostat Validation:", thermostatValidation);
console.log("Thermostat Summary:", thermostatSummary);
console.log("Property Classification:", {
  brightnessType,
  modeType,
  enabledType,
});
console.log(
  "Is SmartLight:",
  isLight,
  "Is Thermostat a Light:",
  isThermostatALight,
);
