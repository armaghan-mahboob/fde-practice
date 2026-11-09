interface Employee {
  readonly id: number;
  name: string;
  code: string;
  monthlySalary: number;
}

interface Product {
  readonly id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Account {
  accountNumber: string;
  balance: number;
}

interface Customer {
  readonly id: number;
  name: string;
}

type CustomerAccount = Customer & Account;

interface RetailCustomer extends CustomerAccount {
  category: "retail";
  loyaltyPoints: number;
}

interface BusinessCustomer extends CustomerAccount {
  category: "business";
  taxId: string;
}

type CustomerCategory = RetailCustomer | BusinessCustomer;

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
type SalaryAdjustment = (employee: Employee, amount: number) => number;
type EmployeeProcessor = (employee: Employee) => string;
type ValidationCallback = (employee: Employee) => string;

const employees: Employee[] = [
  { id: 1, name: "Ali Khan", code: "EMP-A1", monthlySalary: 85000 },
  { id: 2, name: "Sana Ahmed", code: "EMP-B2", monthlySalary: 120000 },
];

const products: Product[] = [
  { id: 1, name: "Laptop", price: 150000, quantity: 1 },
  { id: 2, name: "Mouse", price: 2500, quantity: 2 },
];

function searchEmployee(id: number): Employee | undefined;
function searchEmployee(code: string): Employee | undefined;
function searchEmployee(searchTerm: number | string): Employee | undefined {
  if (typeof searchTerm === "number") {
    return employees.find((e) => e.id === searchTerm);
  } else if (typeof searchTerm === "string") {
    return employees.find((e) => e.code === searchTerm);
  }
  return undefined;
}

function searchProduct(id: number): Product | undefined;
function searchProduct(name: string): Product | undefined;
function searchProduct(searchTerm: number | string): Product | undefined {
  if (typeof searchTerm === "number") {
    return products.find((p) => p.id === searchTerm);
  } else if (typeof searchTerm === "string") {
    return products.find((p) => p.name === searchTerm);
  }
  return undefined;
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

function calculateAnnualSalary(
  employee: Employee,
  adjust: SalaryAdjustment,
): number {
  const adjustedMonthly = adjust(employee, employee.monthlySalary);
  return adjustedMonthly * 12;
}

function getAccountSummary(account: CustomerAccount): string {
  return `Customer: ${account.name}, Account: ${account.accountNumber}, Balance: PKR ${account.balance}`;
}

function getCategoryMessage(customer: CustomerCategory): string {
  if (customer.category === "retail") {
    return `Retail customer ${customer.name} has ${customer.loyaltyPoints} loyalty points.`;
  } else {
    return `Business customer ${customer.name} is registered with Tax ID: ${customer.taxId}.`;
  }
}

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

function validateExternalData(data: unknown): data is Employee {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.code === "string" &&
    typeof obj.monthlySalary === "number"
  );
}

const consoleNotifier: NotificationCallback = (message) => {
  console.log(message);
};

const bonusAdjustment: SalaryAdjustment = (employee, amount) => amount + 10000;

console.log("--- Employee Retrieval ---");
const emp1 = searchEmployee(1);
if (emp1) {
  console.log(
    `Found: ${emp1.name}, Annual Salary: PKR ${calculateAnnualSalary(emp1, bonusAdjustment)}`,
  );
} else {
  console.log("Employee not found");
}
const empNotFound = searchEmployee("EMP-X9");
console.log(`EMP-X9 Search Result: ${empNotFound ? "Found" : "Not Found"}`);

console.log("--- Product Retrieval and Pricing ---");
const prod1 = searchProduct("Laptop");
if (prod1) {
  console.log(
    `Found: ${prod1.name}, Total: PKR ${calculatePrice(prod1, 10, "SAVE10", 500)}`,
  );
}
const prodNotFound = searchProduct(99);
console.log(
  `Product 99 Search Result: ${prodNotFound ? "Found" : "Not Found"}`,
);

console.log("--- Customer Account ---");
const retailCustomer: RetailCustomer = {
  id: 1,
  name: "Ali Khan",
  accountNumber: "ACC-1001",
  balance: 50000,
  category: "retail",
  loyaltyPoints: 250,
};
console.log(getAccountSummary(retailCustomer));
console.log(getCategoryMessage(retailCustomer));

console.log("--- Payment and Order State ---");
const order1: Order = { orderId: "ORD-001", amount: 45000 };
const result1 = processPayment(order1, "credit_card");
handleOrderState(order1, result1, consoleNotifier);

const order2: Order = { orderId: "ORD-002", amount: 250000 };
const result2 = processPayment(order2, "credit_card");
handleOrderState(order2, result2, consoleNotifier);

console.log("--- External Data Validation ---");
const externalData: unknown = {
  id: 3,
  name: "Bilal",
  code: "EMP-C3",
  monthlySalary: 95000,
};
if (validateExternalData(externalData)) {
  console.log(`Validated Employee: ${externalData.name}`);
} else {
  console.log("Invalid external data");
}

const invalidExternalData: unknown = { id: "3", name: "Bilal" };
if (validateExternalData(invalidExternalData)) {
  console.log(`Validated Employee: ${invalidExternalData.name}`);
} else {
  console.log("Invalid external data rejected");
}

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

function throwErrorExample() {
  try {
    throw new CustomError("Something went wrong");
  } catch (error) {
    if (error instanceof CustomError) {
      console.log(`Caught CustomError: ${error.message}`);
    } else {
      console.log("Caught unknown error");
    }
  }
}
throwErrorExample();
