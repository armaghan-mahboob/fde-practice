type OrderStatus = "pending" | "completed" | "cancelled";

interface Order {
  id: number;
  status: OrderStatus;
}

interface PaymentSuccess {
  kind: "success";
  transactionRef: string;
}

interface PaymentFailure {
  kind: "failure";
  reason: string;
}

interface PaymentPending {
  kind: "pending";
  retrySeconds: number;
}

type PaymentResult = PaymentSuccess | PaymentFailure | PaymentPending;

function displayPaymentResult(result: PaymentResult): string {
  switch (result.kind) {
    case "success":
      return `Payment confirmed: ${result.transactionRef}`;
    case "failure":
      return `Payment failed: ${result.reason}`;
    case "pending":
      return `Payment pending, retry in ${result.retrySeconds} seconds`;
    default:
      const exhaustiveCheck: never = result;
      return exhaustiveCheck;
  }
}

function displayOrderStatus(order: Order): string {
  switch (order.status) {
    case "pending":
      return `Order ${order.id}: awaiting payment`;
    case "completed":
      return `Order ${order.id}: payment completed`;
    case "cancelled":
      return `Order ${order.id}: order cancelled`;
    default:
      const exhaustiveCheck: never = order.status;
      return exhaustiveCheck;
  }
}

const order1: Order = { id: 501, status: "completed" };
const order2: Order = { id: 502, status: "pending" };

const payment1: PaymentResult = { kind: "success", transactionRef: "TX-501" };

console.log(displayOrderStatus(order1));
console.log(displayPaymentResult(payment1));
console.log(displayOrderStatus(order2));

/*
// Adding a new order state shows the compiler detecting a missing case:

type ExtendedOrderStatus = OrderStatus | "refunded";

interface ExtendedOrder {
  id: number;
  status: ExtendedOrderStatus;
}

function displayExtendedOrderStatus(order: ExtendedOrder): string {
  switch (order.status) {
    case "pending":
      return `Order ${order.id}: awaiting payment`;
    case "completed":
      return `Order ${order.id}: payment completed`;
    case "cancelled":
      return `Order ${order.id}: order cancelled`;
    default:
      const exhaustiveCheck: never = order.status;
      // Type '"refunded"' is not assignable to type 'never'.
      return exhaustiveCheck;
  }
}
*/
