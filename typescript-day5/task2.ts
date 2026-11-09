interface Product {
  name: string;
  price: number;
  quantity: number;
}

function calculatePrice(
  product: Product,
  discountPercent: number = 10,
  couponLabel?: string,
  ...adjustments: number[]
): number {
  const baseTotal = product.price * product.quantity;
  const discountAmount = baseTotal * (discountPercent / 100);
  let finalTotal = baseTotal - discountAmount;

  for (const adjustment of adjustments) {
    finalTotal += adjustment;
  }

  if (couponLabel !== undefined) {
    console.log(`Applied Coupon: ${couponLabel}`);
  }

  return finalTotal;
}

const product1: Product = { name: "Laptop", price: 150000, quantity: 1 };
const product2: Product = { name: "Mouse", price: 2500, quantity: 2 };
const product3: Product = { name: "Keyboard", price: 5000, quantity: 1 };
const product4: Product = { name: "Monitor", price: 40000, quantity: 1 };

const baseTotal1 = product1.price * product1.quantity;
const defaultDiscountTotal1 = baseTotal1 - baseTotal1 * 0.1;
const customDiscountTotal2 =
  product2.price * product2.quantity - product2.price * product2.quantity * 0.2;

console.log(`Base Total: ${baseTotal1}`);
console.log(`Default-Discount Total: ${defaultDiscountTotal1}`);
console.log(`Custom-Discount Total: ${customDiscountTotal2}`);
console.log(
  `Adjusted Total (Product 3): ${calculatePrice(product3, 5, "SAVE10", 500, -200)}`,
);
console.log(
  `Adjusted Total (Product 4): ${calculatePrice(product4, 15, undefined, 1000)}`,
);
