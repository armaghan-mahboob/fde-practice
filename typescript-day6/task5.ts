interface NotificationService {
  send(recipient: string, message: string): string;
}

class EmailProvider implements NotificationService {
  send(recipient: string, message: string): string {
    if (!recipient.includes("@")) {
      throw new Error("Invalid email address format.");
    }
    if (message.trim() === "") {
      throw new Error("Message cannot be empty.");
    }
    return `Email sent to ${recipient}: "${message}"`;
  }
}

class SMSProvider implements NotificationService {
  send(recipient: string, message: string): string {
    if (!/^\d{10,15}$/.test(recipient)) {
      throw new Error("Invalid phone number. Must be 10-15 digits.");
    }
    if (message.trim() === "") {
      throw new Error("Message cannot be empty.");
    }
    return `SMS sent to ${recipient}: "${message}"`;
  }
}

class PushProvider implements NotificationService {
  send(recipient: string, message: string): string {
    if (recipient.trim() === "") {
      throw new Error("Device token cannot be empty.");
    }
    if (message.trim() === "") {
      throw new Error("Message cannot be empty.");
    }
    return `Push notification sent to device ${recipient}: "${message}"`;
  }
}

class NotificationManager {
  private service: NotificationService;

  constructor(service: NotificationService) {
    this.service = service;
  }

  public notify(recipient: string, message: string): string {
    return this.service.send(recipient, message);
  }
}

console.log("--- Valid Notifications ---");
const emailManager = new NotificationManager(new EmailProvider());
console.log(emailManager.notify("ali@example.com", "Welcome to the system!"));

const smsManager = new NotificationManager(new SMSProvider());
console.log(smsManager.notify("03001234567", "Your OTP is 1234."));

const pushManager = new NotificationManager(new PushProvider());
console.log(
  pushManager.notify("device-token-abc123", "You have a new message."),
);

console.log("\n--- Invalid Cases ---");
try {
  new NotificationManager(new EmailProvider()).notify("invalid-email", "Hello");
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

try {
  new NotificationManager(new SMSProvider()).notify("abc", "Hello");
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

try {
  new NotificationManager(new PushProvider()).notify("device-token-abc123", "");
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

/*
 * SHORT DESIGN EXPLANATION
 *
 * OOP Choice (is-a / has-a decisions):
 * - EmailProvider, SMSProvider, and PushProvider are completely unrelated classes, so
 *   they do not share an inheritance ("is-a") relationship. Instead, they each implement
 *   the NotificationService interface, acting as specific implementations of a contract.
 * - NotificationManager "has-a" NotificationService (composition). It relies on the
 *   abstraction rather than concrete classes.
 * - This demonstrates the Dependency Inversion Principle: the manager depends on an
 *   interface, not concrete implementations. The interface is injected via the constructor,
 *   meaning the manager never instantiates a provider itself.
 *
 * Encapsulation:
 * - The `service` property in NotificationManager is `private`, preventing external
 *   replacement after construction.
 * - Business rule validation (email format, phone number format, empty messages) is
 *   encapsulated within each provider's `send` method.
 */
