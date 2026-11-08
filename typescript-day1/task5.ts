export type Customer = {
  fullName: string;
};

export function calculateLineTotal(price: number, quantity: number): number {
  if (price < 0 || quantity < 0) {
    throw new Error("Price and quantity must be positive.");
  }
  return price * quantity;
}

export function applyDiscount(total: number, percent: number): number {
  if (percent < 0 || percent > 100) {
    throw new Error("Discount percent must be between 0 and 100.");
  }
  return total - (total * percent) / 100;
}

export function createReceipt(customer: Customer, total: number): string {
  return `Receipt created for ${customer.fullName}: Total is Rs. ${total}`;
}

export function addStock(currentStock: number, amount: number): number {
  if (amount <= 0) {
    throw new Error("Stock addition amount must be greater than zero.");
  }
  return currentStock + amount;
}

// Documented rule: Return numeric fee (0 for free shipping) for consistent calculation.
export function getShippingFee(orderTotal: number): number {
  if (orderTotal < 0) {
    throw new Error("Order total cannot be negative.");
  }
  if (orderTotal >= 5000) {
    return 0;
  }
  return 250;
}
