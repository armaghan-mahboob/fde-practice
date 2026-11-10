class BankAccount {
  readonly accountNumber: string;
  private balance: number;

  constructor(accountNumber: string, initialBalance: number) {
    if (initialBalance < 0) {
      throw new Error("Initial balance cannot be negative.");
    }
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
  }

  public deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be greater than zero.");
    }
    this.balance += amount;
  }

  public withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be greater than zero.");
    }
    if (amount > this.balance) {
      throw new Error("Overdraft rejected: Insufficient funds.");
    }
    this.balance -= amount;
  }

  public getBalance(): number {
    return this.balance;
  }

  public getSummary(): string {
    return `Account: ${this.accountNumber}, Current Balance: PKR ${this.balance}`;
  }
}

console.log("--- Valid Transactions ---");
const account1 = new BankAccount("PK-ACC-1001", 50000);
console.log(`Opening: ${account1.getSummary()}`);

account1.deposit(25000);
console.log(`Deposited 25000: ${account1.getSummary()}`);

account1.withdraw(15000);
console.log(`Withdrawn 15000: ${account1.getSummary()}`);

console.log(`Final Balance: PKR ${account1.getBalance()}`);

console.log("\n--- Invalid Transactions ---");
try {
  account1.deposit(0);
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

try {
  account1.withdraw(-500);
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

try {
  account1.withdraw(1000000);
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

//   Encapsulation:
//   - `balance` is marked `private`, so it cannot be accessed or modified directly from
//     outside the class. This enforces the requirement of "No public balance setter."
//   - `accountNumber` is marked `readonly`, ensuring it is set only once during construction.
//   - All modifications to `balance` go through public methods (`deposit`, `withdraw`) that
//     strictly validate business rules before mutating state.
//   - `getBalance()` is the only way to read the private balance, and `getSummary()` formats
//     the output.
