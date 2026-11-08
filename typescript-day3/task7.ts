interface User {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface StockDetails {
  stock: number;
  warehouse: string;
}

type StockedProduct = Product & StockDetails;

interface ContactInfo {
  email: string;
}

interface UserSuccessResponse {
  kind: "user_success";
  data: User & ContactInfo;
}

interface ProductSuccessResponse {
  kind: "product_success";
  data: StockedProduct;
}

interface ApiFailure {
  kind: "failure";
  message: string;
}

type ApiResponse = UserSuccessResponse | ProductSuccessResponse | ApiFailure;

interface PaymentSuccess {
  kind: "payment_success";
  transactionRef: string;
}

interface PaymentPending {
  kind: "payment_pending";
  retrySeconds: number;
}

interface PaymentFailure {
  kind: "payment_failure";
  reason: string;
}

type PaymentOutcome = PaymentSuccess | PaymentPending | PaymentFailure;

function handleUserRequest(response: ApiResponse): void {
  if (response.kind === "failure") {
    console.log(`User request failed: ${response.message}`);
    return;
  }
  if (response.kind === "user_success") {
    console.log(`User loaded: ${response.data.name}`);
  }
}

function handleProductRequest(response: ApiResponse): void {
  if (response.kind === "failure") {
    console.log(`Product request failed: ${response.message}`);
    return;
  }
  if (response.kind === "product_success") {
    console.log(
      `Product loaded: ${response.data.name} — stock ${response.data.stock}`,
    );
  }
}

function processIdentifier(id: string | number | null): string {
  if (id === null) {
    return "No identifier";
  }
  if (typeof id === "number") {
    return `Numeric: ${id}`;
  }
  return `Text: ${id}`;
}

function findContact(value: unknown): string {
  if (value instanceof Error) {
    return `Error contact: ${value.message}`;
  }
  if (typeof value === "string") {
    return `Text contact: ${value}`;
  }
  if (typeof value === "object" && value !== null && "email" in value) {
    return `Email contact: ${String((value as ContactInfo).email)}`;
  }
  return "Unknown contact";
}

function displayPaymentOutcome(outcome: PaymentOutcome): void {
  switch (outcome.kind) {
    case "payment_success":
      console.log(`Payment confirmed: ${outcome.transactionRef}`);
      break;
    case "payment_pending":
      console.log(`Payment pending, retry in ${outcome.retrySeconds} seconds`);
      break;
    case "payment_failure":
      console.log(`Payment failed: ${outcome.reason}`);
      break;
    default:
      const exhaustiveCheck: never = outcome;
      return exhaustiveCheck;
  }
}

const userSuccess: ApiResponse = {
  kind: "user_success",
  data: { id: 1, name: "Hira", email: "hira@example.com" },
};

const productSuccess: ApiResponse = {
  kind: "product_success",
  data: { id: 10, name: "Keyboard", price: 5000, stock: 8, warehouse: "A" },
};

const userFailure: ApiResponse = {
  kind: "failure",
  message: "User service unavailable",
};

const productFailure: ApiResponse = {
  kind: "failure",
  message: "Product not found",
};

const payment: PaymentOutcome = {
  kind: "payment_success",
  transactionRef: "PAY-501",
};

handleUserRequest(userSuccess);
handleProductRequest(productSuccess);
handleUserRequest(userFailure);
handleProductRequest(productFailure);
displayPaymentOutcome(payment);

console.log(processIdentifier(42));
console.log(processIdentifier("abc-42"));
console.log(findContact(new Error("timeout")));

/*
// Incorrect property access before narrowing (compiler error example):

const unsafeResponse: ApiResponse = userSuccess;
// console.log(unsafeResponse.data.name);
// Property 'data' does not exist on type 'ApiResponse'.
//   Property 'data' does not exist on type 'ApiFailure'.
*/
