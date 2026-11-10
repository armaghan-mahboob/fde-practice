class Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;

  constructor(id: string, name: string, price: number) {
    if (price <= 0) {
      throw new Error("Price must be greater than zero.");
    }
    if (name.trim() === "") {
      throw new Error("Product name cannot be empty.");
    }
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

interface IInventory {
  getStock(productId: string): number;
  reduceStock(productId: string, quantity: number): void;
}

class InventoryManager implements IInventory {
  private stockLevels: Map<string, number> = new Map();

  public addStock(product: Product, quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Stock quantity to add must be greater than zero.");
    }
    const current = this.stockLevels.get(product.id) || 0;
    this.stockLevels.set(product.id, current + quantity);
  }

  public getStock(productId: string): number {
    return this.stockLevels.get(productId) || 0;
  }

  public reduceStock(productId: string, quantity: number): void {
    const current = this.getStock(productId);
    if (quantity > current) {
      throw new Error(
        `Insufficient stock for product ${productId}. Available: ${current}, Requested: ${quantity}`,
      );
    }
    this.stockLevels.set(productId, current - quantity);
  }
}

class OrderItem {
  readonly product: Product;
  readonly quantity: number;

  constructor(product: Product, quantity: number) {
    if (quantity <= 0) {
      throw new Error("Order item quantity must be greater than zero.");
    }
    this.product = product;
    this.quantity = quantity;
  }

  getSubtotal(): number {
    return this.product.price * this.quantity;
  }
}

class Customer {
  readonly id: string;
  readonly name: string;

  constructor(id: string, name: string) {
    if (name.trim() === "") {
      throw new Error("Customer name cannot be empty.");
    }
    this.id = id;
    this.name = name;
  }
}

class Order {
  readonly orderId: string;
  readonly customer: Customer;
  private items: OrderItem[] = [];
  private inventory: IInventory;

  constructor(orderId: string, customer: Customer, inventory: IInventory) {
    this.orderId = orderId;
    this.customer = customer;
    this.inventory = inventory;
  }

  public addItem(product: Product, quantity: number): void {
    if (this.inventory.getStock(product.id) < quantity) {
      throw new Error(
        `Cannot add item. Insufficient stock for ${product.name}.`,
      );
    }
    this.items.push(new OrderItem(product, quantity));
  }

  public placeOrder(): string {
    let total = 0;
    for (const item of this.items) {
      this.inventory.reduceStock(item.product.id, item.quantity);
      total += item.getSubtotal();
    }
    return `Order ${this.orderId} placed successfully for ${this.customer.name}. Total: PKR ${total}`;
  }

  public getOrderSummary(): string {
    let summary = `Order Summary for ${this.orderId} (Customer: ${this.customer.name}):\n`;
    this.items.forEach((item) => {
      summary += `- ${item.product.name} x${item.quantity} @ PKR ${item.product.price} = PKR ${item.getSubtotal()}\n`;
    });
    return summary.trim();
  }
}

console.log("--- Setup Inventory ---");
const inventory = new InventoryManager();
const laptop = new Product("P-001", "Lenovo Laptop", 150000);
const mouse = new Product("P-002", "Logitech Mouse", 3500);

inventory.addStock(laptop, 10);
inventory.addStock(mouse, 50);
console.log(`Initial Laptop Stock: ${inventory.getStock("P-001")}`);
console.log(`Initial Mouse Stock: ${inventory.getStock("P-002")}`);

console.log("\n--- Valid Order Placement ---");
const customer1 = new Customer("C-001", "Ali Raza");
const order1 = new Order("ORD-001", customer1, inventory);

order1.addItem(laptop, 2);
order1.addItem(mouse, 5);
console.log(order1.getOrderSummary());
console.log(order1.placeOrder());

console.log(`Updated Laptop Stock: ${inventory.getStock("P-001")}`);
console.log(`Updated Mouse Stock: ${inventory.getStock("P-002")}`);

console.log("\n--- Invalid Cases ---");
try {
  const order2 = new Order(
    "ORD-002",
    new Customer("C-002", "Sara Khan"),
    inventory,
  );
  order2.addItem(laptop, 20);
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

try {
  new Product("P-003", "Invalid Product", -500);
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

try {
  order1.addItem(mouse, 0);
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

/*
 * SHORT DESIGN EXPLANATION
 *
 * OOP Choice (is-a / has-a decisions):
 * - This design intentionally avoids inheritance ("is-a") because the entities
 *   (Product, InventoryManager, Customer, Order) are distinctly different concepts
 *   with no natural parent-child relationships.
 * - Composition ("has-a") is used extensively:
 *   - An Order has-a Customer.
 *   - An Order has-a list of OrderItems.
 *   - An OrderItem has-a Product and a quantity.
 *   - An Order has-an IInventory reference (dependency injection) to validate and
 *     reduce stock.
 * - The IInventory interface decouples the Order from the concrete InventoryManager,
 *   allowing different inventory strategies in the future.
 *
 * Encapsulation:
 * - All core identity fields (Product id/name/price, Customer id/name, Order id)
 *   are `readonly`.
 * - `InventoryManager`'s `stockLevels` is `private`, exposing state only through
 *   validated methods (`addStock`, `getStock`, `reduceStock`).
 * - `Order`'s `items` array is `private`; items can only be added via `addItem`,
 *   which enforces stock validation before adding.
 * - Business rules (positive price, positive quantity, sufficient stock) are
 *   validated at construction and mutation points.
 */
