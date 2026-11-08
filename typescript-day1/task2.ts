type Product = {
  name: string;
  price: number;
  quantity: number;
};

function calculateLineTotal(price: number, quantity: number): number {
  return price * quantity;
}

function calculateSubtotal(products: Product[]): number {
  let subtotal = 0;
  for (const product of products) {
    subtotal += calculateLineTotal(product.price, product.quantity);
  }
  return subtotal;
}

function calculateDiscount(subtotal: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount percentage must be between 0 and 100.");
  }
  return subtotal * (discountPercent / 100);
}

function printReceipt(products: Product[], discountPercent: number): void {
  let subtotal: number = calculateSubtotal(products);
  let discountAmount: number = calculateDiscount(subtotal, discountPercent);
  let finalTotal: number = subtotal - discountAmount;

  for (const item of products) {
    let lineTotal = calculateLineTotal(item.price, item.quantity);
    console.log(`${item.name} x ${item.quantity} = Rs. ${lineTotal}`);
  }

  console.log(`Subtotal: Rs. ${subtotal}`);
  console.log(`Discount (${discountPercent}%): Rs. ${discountAmount}`);
  console.log(`Final total: Rs. ${finalTotal}`);
}

const shoppingCart: Product[] = [
  { name: "Notebook", price: 150, quantity: 2 },
  { name: "Pen", price: 50, quantity: 3 },
  { name: "Eraser", price: 20, quantity: 1 },
  { name: "Ruler", price: 40, quantity: 1 },
];

printReceipt(shoppingCart, 10);
