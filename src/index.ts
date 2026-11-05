// const courseName: string = "TypeScript";
// const durationHours = 5;

// function describeCourse(name: string, hours: number): string {
//   return `${name} training takes ${hours} hours.`;
// }

// console.log(describeCourse(courseName, durationHours));

// ---------------------------------------------------------------------

// javascript to typescript conversion test

import {
  calculateLineTotal,
  applyDiscount,
  createReceipt,
  addStock,
  getShippingFee,
} from "./typescript-day1/javascriptToTypescript";

const customer: { fullName: string } = { fullName: "Amina" };

let lineTotal: number = calculateLineTotal(1000, 2);
console.log(`Line total: Rs. ${lineTotal}`);

let discountedTotal: number = applyDiscount(lineTotal, 10);
console.log(`Discounted total: Rs. ${discountedTotal}`);

let newStock: number = addStock(20, 5);
console.log(`Stock after addition: ${newStock}`);

let shippingFee: number = getShippingFee(discountedTotal);
console.log(`Shipping fee: Rs. ${shippingFee}`);

let receipt: string = createReceipt(customer, discountedTotal);
console.log(receipt.split(":")[0]);

console.log("\n--- Testing Invalid Inputs ---");

try {
  applyDiscount(1000, 150);
} catch (error) {
  console.log("Error caught: Discount cannot exceed 100%.");
}

try {
  getShippingFee(-500);
} catch (error) {
  console.log("Error caught: Order total cannot be negative.");
}
