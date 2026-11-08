type OrderStatus = "pending" | "processing" | "shipped" | "delivered";
type PaymentStatus = "unpaid" | "paid" | "refunded";

const order1: {
  id: number;
  customer: string;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
} = {
  id: 7001,
  customer: "Ali",
  total: 5000,
  orderStatus: "processing",
  paymentStatus: "paid",
};

const order2: typeof order1 = {
  id: 7002,
  customer: "Ayesha",
  total: 2500,
  orderStatus: "pending",
  paymentStatus: "unpaid",
};

console.log(
  `Order #${order1.id}: ${order1.orderStatus} | Payment: ${order1.paymentStatus}`,
);
console.log(
  `Order #${order2.id}: ${order2.orderStatus} | Payment: ${order2.paymentStatus}`,
);

order1.orderStatus = "shipped";
order2.paymentStatus = "paid";

console.log(
  `Order #${order1.id}: ${order1.orderStatus} | Payment: ${order1.paymentStatus}`,
);
console.log(
  `Order #${order2.id}: ${order2.orderStatus} | Payment: ${order2.paymentStatus}`,
);

// order1.orderStatus = "cancelled";
// order2.paymentStatus = "failed";
