// POORLY DESIGNED APPLICATION

class BadEntity {
  public id: string;
  public name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

class BadSystem {
  public employees: BadEntity[] = [];
  public products: BadEntity[] = [];
  public customers: BadEntity[] = [];

  public addEmployee(id: string, name: string, salary: number): void {
    this.employees.push(new BadEntity(id, name));
    console.log(`Added employee: ${name} with salary ${salary}`);
  }

  public addProduct(id: string, name: string, price: number): void {
    this.products.push(new BadEntity(id, name));
    console.log(`Added product: ${name} at price ${price}`);
  }

  public placeOrder(
    customerId: string,
    productId: string,
    quantity: number,
  ): void {
    console.log(
      `Order placed for customer ${customerId}, product ${productId}, qty ${quantity}`,
    );
  }

  public sendEmail(to: string, message: string): void {
    console.log(`Email sent to ${to}: ${message}`);
  }

  public processPayment(amount: number): void {
    console.log(`Processed payment of ${amount}`);
  }
}

// IMPROVED APPLICATION ARCHITECTURE

interface INotificationService {
  send(recipient: string, message: string): string;
}

class EmailService implements INotificationService {
  send(recipient: string, message: string): string {
    if (!recipient.includes("@")) throw new Error("Invalid email format.");
    return `Email sent to ${recipient}: ${message}`;
  }
}

abstract class BasePayment {
  readonly amount: number;
  constructor(amount: number) {
    if (amount <= 0) throw new Error("Payment amount must be > 0.");
    this.amount = amount;
  }
  abstract process(): string;
}

class CardPayment extends BasePayment {
  readonly cardNumber: string;
  constructor(amount: number, cardNumber: string) {
    super(amount);
    if (cardNumber.length !== 16) throw new Error("Invalid card number.");
    this.cardNumber = cardNumber;
  }
  process(): string {
    return `Processed PKR ${this.amount} via Card ending in ${this.cardNumber.slice(-4)}`;
  }
}

abstract class Person {
  readonly id: string;
  readonly name: string;
  constructor(id: string, name: string) {
    if (name.trim() === "") throw new Error("Name cannot be empty.");
    this.id = id;
    this.name = name;
  }
}

class Employee extends Person {
  protected salary: number;
  constructor(id: string, name: string, salary: number) {
    super(id, name);
    if (salary <= 0) throw new Error("Salary must be > 0.");
    this.salary = salary;
  }
  describeRole(): string {
    return `Employee: ${this.name}, Salary: ${this.salary}`;
  }
}

class Manager extends Employee {
  readonly department: string;
  constructor(id: string, name: string, salary: number, department: string) {
    super(id, name, salary);
    this.department = department;
  }
  describeRole(): string {
    return `Manager: ${this.name}, Dept: ${this.department}, Salary: ${this.salary}`;
  }
}

class Customer extends Person {
  readonly email: string;
  constructor(id: string, name: string, email: string) {
    super(id, name);
    this.email = email;
  }
}

class Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  constructor(id: string, name: string, price: number) {
    if (price <= 0) throw new Error("Price must be > 0.");
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class InventoryManager {
  private stock: Map<string, number> = new Map();

  addStock(productId: string, qty: number): void {
    if (qty <= 0) throw new Error("Qty must be > 0.");
    this.stock.set(productId, (this.stock.get(productId) || 0) + qty);
  }

  getStock(productId: string): number {
    return this.stock.get(productId) || 0;
  }

  reduceStock(productId: string, qty: number): void {
    const current = this.getStock(productId);
    if (qty > current) throw new Error(`Insufficient stock for ${productId}.`);
    this.stock.set(productId, current - qty);
  }
}

class Order {
  readonly orderId: string;
  readonly customer: Customer;
  private items: { product: Product; qty: number }[] = [];
  private inventory: InventoryManager;
  private paymentProcessor: BasePayment;
  private notifier: INotificationService;

  constructor(
    orderId: string,
    customer: Customer,
    inventory: InventoryManager,
    paymentProcessor: BasePayment,
    notifier: INotificationService,
  ) {
    this.orderId = orderId;
    this.customer = customer;
    this.inventory = inventory;
    this.paymentProcessor = paymentProcessor;
    this.notifier = notifier;
  }

  addItem(product: Product, qty: number): void {
    if (qty <= 0) throw new Error("Qty must be > 0.");
    if (this.inventory.getStock(product.id) < qty)
      throw new Error(`Insufficient stock for ${product.name}.`);
    this.items.push({ product, qty });
  }

  checkout(): string {
    let total = 0;
    for (const item of this.items) {
      this.inventory.reduceStock(item.product.id, item.qty);
      total += item.product.price * item.qty;
    }
    const paymentReceipt = this.paymentProcessor.process();
    const notification = this.notifier.send(
      this.customer.email,
      `Your order ${this.orderId} is confirmed.`,
    );
    return `Order ${this.orderId} Total: PKR ${total} | ${paymentReceipt} | ${notification}`;
  }
}

console.log("--- Running Improved Architecture ---");
const inventory = new InventoryManager();
const laptop = new Product("P1", "Laptop", 150000);
inventory.addStock(laptop.id, 10);

// FIX 1: Customer now has a valid email address.
const customer = new Customer("C1", "Ali", "ali@example.com");
const payment = new CardPayment(300000, "1234567890123456");
const emailService = new EmailService();

const order = new Order("ORD-1", customer, inventory, payment, emailService);
order.addItem(laptop, 2);

// FIX 2: Wrapped in try...catch so execution doesn't stop.
try {
  console.log(order.checkout());
} catch (error: any) {
  console.log(`Checkout failed: ${error.message}`);
}

console.log(`Remaining Laptop Stock: ${inventory.getStock(laptop.id)}`);

console.log("\n--- Invalid Cases ---");
try {
  order.addItem(laptop, 10);
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

try {
  new Manager("M1", "Sara", -5000, "HR");
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

/*
 * SHORT DESIGN EXPLANATION
 *
 * 1. Identification of Poor Design (Original):
 *    - Duplicated members: `BadEntity` was used for employees, products, and customers,
 *      forcing irrelevant properties and losing domain-specific attributes.
 *    - Excessive responsibilities: `BadSystem` acted as a "God Object" handling
 *      employees, products, orders, payments, and notifications all in one class.
 *    - Public mutable state: Arrays were public, allowing uncontrolled modification
 *      from outside.
 *
 * 2. Genuine Inheritance (is-a):
 *    - `Employee` and `Customer` now genuinely inherit from the abstract `Person` class,
 *      sharing core identity (`id`, `name`).
 *    - `Manager` inherits from `Employee`, adding department-specific context and
 *      overriding `describeRole()`.
 *    - `CardPayment` inherits from the abstract `BasePayment`, sharing amount validation
 *      but providing its own processing logic.
 *
 * 3. Composition (has-a) and Constructor Injection:
 *    - `Order` "has-a" `Customer`, a list of items (Products), an `InventoryManager`,
 *      a `BasePayment`, and an `INotificationService`.
 *    - Instead of instantiating these inside the `Order`, they are injected via the
 *      constructor. This decouples `Order` from concrete implementations, adhering
 *      to the Dependency Inversion Principle and making the system highly testable.
 *
 * 4. Interfaces and Encapsulation:
 *    - `INotificationService` provides a contract for communication methods.
 *    - Internal state like `InventoryManager.stock` and `Order.items` are `private`,
 *      exposing only validated behaviors (`addStock`, `addItem`).
 *    - `readonly` and `protected` modifiers protect identity and inheritance state.
 */
