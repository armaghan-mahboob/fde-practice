interface UserRegistrationPayload {
  userId: string;
  email: string;
}

interface PasswordResetPayload {
  userId: string;
  resetToken: string;
}

interface DeviceStatusPayload {
  deviceId: string;
  online: boolean;
}

interface AppointmentReminderPayload {
  appointmentId: string;
  reminderTime: string;
}

interface MaintenancePayload {
  systemId: string;
  scheduledDate: string;
}

interface SubscriptionRenewalPayload {
  subscriptionId: string;
  renewalDate: string;
}

interface SourceEventMap {
  "user.registration": UserRegistrationPayload;
  "user.passwordReset": PasswordResetPayload;
  "device.statusChanged": DeviceStatusPayload;
  "appointment.reminder": AppointmentReminderPayload;
  "maintenance.scheduled": MaintenancePayload;
  "subscription.renewal": SubscriptionRenewalPayload;
}

type SourceEventNames = keyof SourceEventMap;

type EventCategory =
  | "user"
  | "device"
  | "appointment"
  | "maintenance"
  | "subscription";
type GeneratedEventName<
  C extends EventCategory,
  A extends string,
> = `${C}.${A}`;

type ValidEventName = SourceEventNames;
type UserEvents = Extract<ValidEventName, `user.${string}`>;
type DeviceEvents = Extract<ValidEventName, `device.${string}`>;

type EventPayload<T extends ValidEventName> = SourceEventMap[T];

type IsUserEvent<T extends ValidEventName> = T extends `user.${string}`
  ? true
  : false;
type IsDeviceEvent<T extends ValidEventName> = T extends `device.${string}`
  ? true
  : false;

type EventHandler<T extends ValidEventName> = (
  payload: EventPayload<T>,
) => void;

type ExtractReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type HandlerReturnType<T extends ValidEventName> = ExtractReturnType<
  EventHandler<T>
>;

type HandlerParams<T extends ValidEventName> = Parameters<EventHandler<T>>;

type ReadonlyEventPayload<T extends ValidEventName> = Readonly<EventPayload<T>>;
type PartialEventPayload<T extends ValidEventName> = Partial<EventPayload<T>>;

type EventHandlerContract = {
  [K in ValidEventName]: EventHandler<K>;
};

type InMemoryEventContract = {
  [K in ValidEventName]: {
    listeners: Array<EventHandler<K>>;
    emit: (payload: EventPayload<K>) => void;
  };
};

// Expected compiler error: Type '"invalid.event"' does not satisfy the constraint 'ValidEventName'.
type InvalidEventName = "invalid.event";

// @ts-expect-error - Expected compiler error: Type '(payload: { wrongField: string; }) => void' is not assignable to type 'EventHandler<"device.statusChanged">'.
const incompatibleCallback: EventHandler<"device.statusChanged"> = (payload: {
  wrongField: string;
}) => {};

class InMemoryEventBus implements InMemoryEventContract {
  "user.registration" = {
    listeners: [] as Array<EventHandler<"user.registration">>,
    emit: (payload: EventPayload<"user.registration">) => {
      this["user.registration"].listeners.forEach((l) => l(payload));
    },
  };
  "user.passwordReset" = {
    listeners: [] as Array<EventHandler<"user.passwordReset">>,
    emit: (payload: EventPayload<"user.passwordReset">) => {
      this["user.passwordReset"].listeners.forEach((l) => l(payload));
    },
  };
  "device.statusChanged" = {
    listeners: [] as Array<EventHandler<"device.statusChanged">>,
    emit: (payload: EventPayload<"device.statusChanged">) => {
      this["device.statusChanged"].listeners.forEach((l) => l(payload));
    },
  };
  "appointment.reminder" = {
    listeners: [] as Array<EventHandler<"appointment.reminder">>,
    emit: (payload: EventPayload<"appointment.reminder">) => {
      this["appointment.reminder"].listeners.forEach((l) => l(payload));
    },
  };
  "maintenance.scheduled" = {
    listeners: [] as Array<EventHandler<"maintenance.scheduled">>,
    emit: (payload: EventPayload<"maintenance.scheduled">) => {
      this["maintenance.scheduled"].listeners.forEach((l) => l(payload));
    },
  };
  "subscription.renewal" = {
    listeners: [] as Array<EventHandler<"subscription.renewal">>,
    emit: (payload: EventPayload<"subscription.renewal">) => {
      this["subscription.renewal"].listeners.forEach((l) => l(payload));
    },
  };
}

const eventBus = new InMemoryEventBus();

const eventInput = {
  type: "device.statusChanged",
  payload: { deviceId: "L-1", online: true },
};

const registrationHandler: EventHandler<"user.registration"> = (payload) => {
  console.log(`Registered user ${payload.userId} with email ${payload.email}`);
};

const deviceStatusHandler: EventHandler<"device.statusChanged"> = (payload) => {
  console.log(
    `Device ${payload.deviceId} is ${payload.online ? "online" : "offline"}`,
  );
};

const appointmentHandler: EventHandler<"appointment.reminder"> = (payload) => {
  console.log(
    `Reminder for appointment ${payload.appointmentId} at ${payload.reminderTime}`,
  );
};

const isUser: IsUserEvent<"user.registration"> = true;
const isDevice: IsDeviceEvent<"device.statusChanged"> = true;
const isDeviceUser: IsDeviceEvent<"user.registration"> = false;

const handlerReturn: HandlerReturnType<"device.statusChanged"> = undefined;
const handlerParams: HandlerParams<"device.statusChanged"> = [
  { deviceId: "L-1", online: true },
];

const readonlyPayload: ReadonlyEventPayload<"device.statusChanged"> = {
  deviceId: "L-1",
  online: true,
};

const partialPayload: PartialEventPayload<"device.statusChanged"> = {
  online: false,
};

eventBus["user.registration"].listeners.push(registrationHandler);
eventBus["device.statusChanged"].listeners.push(deviceStatusHandler);
eventBus["appointment.reminder"].listeners.push(appointmentHandler);

eventBus["device.statusChanged"].emit(eventInput.payload);
eventBus["user.registration"].emit({
  userId: "U-1",
  email: "test@example.com",
});
eventBus["appointment.reminder"].emit({
  appointmentId: "A-1",
  reminderTime: "2024-01-01T10:00:00Z",
});

console.log("Event system initialized and handlers registered.");
