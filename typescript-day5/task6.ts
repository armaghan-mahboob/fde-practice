interface Order {
  orderId: string;
  amount: number;
}

type PaymentMethod = "credit_card" | "bank_transfer";

interface PaymentSuccess {
  status: "success";
  transactionId: string;
}

interface PaymentFailed {
  status: "failed";
  reason: string;
}

interface PaymentPending {
  status: "pending";
  reference: string;
}

type PaymentResult = PaymentSuccess | PaymentFailed | PaymentPending;

type NotificationCallback = (message: string) => void;

function processPayment(order: Order, method: "credit_card"): PaymentResult;
function processPayment(
  order: Order,
  method: "bank_transfer",
  reference: string,
): PaymentResult;
function processPayment(
  order: Order,
  method: PaymentMethod,
  reference?: string,
): PaymentResult {
  if (method === "credit_card") {
    if (order.amount > 0 && order.amount <= 100000) {
      return { status: "success", transactionId: `TXN-CC-${order.orderId}` };
    }
    return { status: "failed", reason: "Card declined or limit exceeded" };
  } else {
    if (reference) {
      return { status: "pending", reference: reference };
    }
    return { status: "failed", reason: "Missing bank transfer reference" };
  }
}

function handleOrderState(
  order: Order,
  result: PaymentResult,
  notify: NotificationCallback,
): void {
  notify(`Processing Order: ${order.orderId}`);

  switch (result.status) {
    case "success":
      notify(`Payment Successful. Transaction ID: ${result.transactionId}`);
      break;
    case "failed":
      notify(`Payment Failed. Reason: ${result.reason}`);
      break;
    case "pending":
      notify(`Payment Pending. Reference: ${result.reference}`);
      break;
    default:
      const _exhaustiveCheck: never = result;
      return _exhaustiveCheck;
  }
}

const consoleNotifier: NotificationCallback = (message) => {
  console.log(message);
};

const order1: Order = { orderId: "ORD-001", amount: 45000 };
const order2: Order = { orderId: "ORD-002", amount: 250000 };
const order3: Order = { orderId: "ORD-003", amount: 15000 };

const result1 = processPayment(order1, "credit_card");
const result2 = processPayment(order2, "credit_card");
const result3 = processPayment(order3, "bank_transfer", "REF-99887");

console.log("--- Case 1: Success ---");
handleOrderState(order1, result1, consoleNotifier);

console.log("--- Case 2: Failure ---");
handleOrderState(order2, result2, consoleNotifier);

console.log("--- Case 3: Pending ---");
handleOrderState(order3, result3, consoleNotifier);
