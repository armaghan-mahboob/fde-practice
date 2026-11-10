abstract class Payment {
  readonly amount: number;

  constructor(amount: number) {
    if (amount <= 0) {
      throw new Error("Payment amount must be greater than zero.");
    }
    this.amount = amount;
  }

  abstract process(): string;

  getReceipt(): string {
    return `Receipt: Payment of PKR ${this.amount} successfully processed.`;
  }
}

class CardPayment extends Payment {
  readonly cardNumber: string;

  constructor(amount: number, cardNumber: string) {
    super(amount);
    if (cardNumber.length !== 16) {
      throw new Error("Card number must be 16 digits.");
    }
    this.cardNumber = cardNumber;
  }

  process(): string {
    const masked = "****-****-****-" + this.cardNumber.slice(-4);
    return `Processed PKR ${this.amount} via Credit Card (${masked}).`;
  }
}

class CashPayment extends Payment {
  readonly currency: string;

  constructor(amount: number, currency: string) {
    super(amount);
    if (currency.trim() === "") {
      throw new Error("Currency cannot be empty.");
    }
    this.currency = currency;
  }

  process(): string {
    return `Processed PKR ${this.amount} in Cash (${this.currency}).`;
  }
}

class BankTransferPayment extends Payment {
  readonly accountNumber: string;

  constructor(amount: number, accountNumber: string) {
    super(amount);
    if (accountNumber.trim() === "") {
      throw new Error("Bank account number cannot be empty.");
    }
    this.accountNumber = accountNumber;
  }

  process(): string {
    return `Processed PKR ${this.amount} via Bank Transfer to Account ${this.accountNumber}.`;
  }
}

console.log("--- Valid Payment Processing (Polymorphism) ---");
const payments: Payment[] = [
  new CardPayment(15000, "1234567890123456"),
  new CashPayment(5000, "PKR"),
  new BankTransferPayment(50000, "PK-ACC-987654"),
];

payments.forEach((payment) => {
  console.log(payment.process());
  console.log(payment.getReceipt());
  console.log("---");
});

console.log("--- Invalid Cases ---");
try {
  new CashPayment(-100, "PKR");
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

try {
  new CardPayment(2000, "1234");
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

try {
  new BankTransferPayment(1000, "");
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

/*
 * SHORT DESIGN EXPLANATION
 *
 * OOP Choice (is-a / has-a decisions):
 * - CardPayment, CashPayment, and BankTransferPayment all "is-a" Payment, so they extend
 *   the abstract Payment class. This allows shared behavior (amount validation and
 *   receipt generation) to live in the base class.
 * - Each subclass "has-a" role-specific property: CardPayment has a cardNumber,
 *   CashPayment has a currency, and BankTransferPayment has an accountNumber.
 * - The `Payment` class is abstract, meaning it cannot be instantiated directly,
 *   enforcing that only concrete payment types can be used.
 * - Polymorphism is demonstrated by storing mixed concrete payments in a `Payment[]` and
 *   calling `process()` on each, producing type-specific output.
 *
 * Encapsulation:
 * - `amount` is `readonly`, preventing modification after construction.
 * - Role-specific properties are `readonly` and validated inside subclass constructors.
 * - `getReceipt()` is a concrete method in the abstract class, centralizing receipt logic.
 * - `process()` is abstract, forcing each subclass to provide its own implementation.
 */
