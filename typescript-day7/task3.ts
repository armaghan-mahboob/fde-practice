interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

interface PaginationResult<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  items: T[];
}

type ApiResult<T> =
  | { status: "success"; data: T }
  | { status: "failure"; error: string };

function handleResponse<T>(response: ApiResponse<T>): ApiResult<T> {
  if (response.success && response.data !== null) {
    return { status: "success", data: response.data };
  }
  return { status: "failure", error: response.error ?? "Unknown error" };
}

function isEmployee(value: unknown): value is Employee {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Employee).id === "number" &&
    typeof (value as Employee).firstName === "string" &&
    typeof (value as Employee).lastName === "string"
  );
}

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Product).id === "number" &&
    typeof (value as Product).name === "string" &&
    typeof (value as Product).price === "number"
  );
}

function isCustomer(value: unknown): value is Customer {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Customer).id === "number" &&
    typeof (value as Customer).name === "string" &&
    typeof (value as Customer).email === "string"
  );
}

function parseApiResponse<T>(
  json: string,
  validator: (value: unknown) => value is T,
): ApiResponse<T> {
  try {
    const parsed: unknown = JSON.parse(json);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as ApiResponse<unknown>).success !== "boolean"
    ) {
      return { success: false, data: null, error: "Invalid response envelope" };
    }
    const envelope = parsed as ApiResponse<unknown>;
    if (envelope.success) {
      if (validator(envelope.data)) {
        return { success: true, data: envelope.data, error: null };
      }
      return { success: false, data: null, error: "Invalid payload shape" };
    }
    return {
      success: false,
      data: null,
      error: envelope.error ?? "Request failed",
    };
  } catch {
    return { success: false, data: null, error: "Malformed JSON" };
  }
}

function printPage<T>(result: PaginationResult<T>): void {
  console.log(
    `Page ${result.page} of size ${result.pageSize} (total items: ${result.totalItems})`,
  );
  result.items.forEach((item) => console.log(item));
}

const employeeJson = JSON.stringify({
  success: true,
  data: { id: 1, firstName: "Ayesha", lastName: "Raza" },
  error: null,
});

const productJson = JSON.stringify({
  success: true,
  data: { id: 101, name: "Rice Cooker", price: 8500 },
  error: null,
});

const customerJson = JSON.stringify({
  success: true,
  data: { id: 501, name: "Hassan Ali", email: "hassan.ali@example.com" },
  error: null,
});

const employeeResponse = parseApiResponse(employeeJson, isEmployee);
const productResponse = parseApiResponse(productJson, isProduct);
const customerResponse = parseApiResponse(customerJson, isCustomer);

const employeeResult = handleResponse(employeeResponse);
const productResult = handleResponse(productResponse);
const customerResult = handleResponse(customerResponse);

const employeePage: PaginationResult<Employee> = {
  page: 1,
  pageSize: 10,
  totalItems: 1,
  items: employeeResult.status === "success" ? [employeeResult.data] : [],
};

const productPage: PaginationResult<Product> = {
  page: 1,
  pageSize: 10,
  totalItems: 1,
  items: productResult.status === "success" ? [productResult.data] : [],
};

const customerPage: PaginationResult<Customer> = {
  page: 1,
  pageSize: 10,
  totalItems: 1,
  items: customerResult.status === "success" ? [customerResult.data] : [],
};

console.log("Employees:");
printPage(employeePage);

console.log("Products:");
printPage(productPage);

console.log("Customers:");
printPage(customerPage);

console.log(
  "\nWhy ApiResponse<T> is preferable to three nearly identical response interfaces: a single generic envelope keeps the success/error handling logic written once, while the payload shape is supplied per endpoint as a type argument, avoiding duplicated interface declarations and duplicated handler code.",
);
