interface HasId {
  id: number;
}

interface Employee extends HasId {
  firstName: string;
  lastName: string;
  department: string;
}

interface Product extends HasId {
  name: string;
  price: number;
  category: string;
}

interface Customer extends HasId {
  name: string;
  email: string;
  city: string;
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

interface Repository<T extends HasId> {
  add(item: T): void;
  getAll(): T[];
  getById(id: number): T | undefined;
  remove(id: number): boolean;
  search(predicate: (item: T) => boolean): T[];
}

class MemoryRepository<T extends HasId> implements Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    if (this.getById(item.id) !== undefined) {
      throw new Error(`Item with id ${item.id} already exists`);
    }
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items];
  }

  getById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  remove(id: number): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    this.items.splice(index, 1);
    return true;
  }

  search(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

function transform<T, U>(items: T[], callback: (item: T) => U): U[] {
  return items.map(callback);
}

function handleResponse<T>(response: ApiResponse<T>): T | null {
  if (response.success && response.data !== null) {
    return response.data;
  }
  return null;
}

function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginationResult<T> {
  const start = (page - 1) * pageSize;
  return {
    page,
    pageSize,
    totalItems: items.length,
    items: items.slice(start, start + pageSize),
  };
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

function isEmployee(value: unknown): value is Employee {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Employee).id === "number" &&
    typeof (value as Employee).firstName === "string" &&
    typeof (value as Employee).lastName === "string" &&
    typeof (value as Employee).department === "string"
  );
}

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Product).id === "number" &&
    typeof (value as Product).name === "string" &&
    typeof (value as Product).price === "number" &&
    typeof (value as Product).category === "string"
  );
}

function isCustomer(value: unknown): value is Customer {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Customer).id === "number" &&
    typeof (value as Customer).name === "string" &&
    typeof (value as Customer).email === "string" &&
    typeof (value as Customer).city === "string"
  );
}

const employeeRepo = new MemoryRepository<Employee>();
const productRepo = new MemoryRepository<Product>();
const customerRepo = new MemoryRepository<Customer>();

employeeRepo.add({
  id: 1,
  firstName: "Hira",
  lastName: "Nawaz",
  department: "Operations",
});
employeeRepo.add({
  id: 2,
  firstName: "Saad",
  lastName: "Mirza",
  department: "Finance",
});
employeeRepo.add({
  id: 3,
  firstName: "Rimsha",
  lastName: "Butt",
  department: "Operations",
});

productRepo.add({
  id: 101,
  name: "Washing Machine",
  price: 75000,
  category: "Home",
});
productRepo.add({ id: 102, name: "Blender", price: 6500, category: "Home" });
productRepo.add({
  id: 103,
  name: "Tablet",
  price: 45000,
  category: "Electronics",
});

customerRepo.add({
  id: 501,
  name: "Faizan Ahmed",
  email: "faizan@example.com",
  city: "Karachi",
});
customerRepo.add({
  id: 502,
  name: "Sana Tariq",
  email: "sana@example.com",
  city: "Lahore",
});

const employeeJson = JSON.stringify({
  success: true,
  data: { id: 4, firstName: "Nimra", lastName: "Asghar", department: "Sales" },
  error: null,
});

const productJson = JSON.stringify({
  success: true,
  data: { id: 104, name: "Toaster", price: 4200, category: "Home" },
  error: null,
});

const customerJson = JSON.stringify({
  success: true,
  data: {
    id: 503,
    name: "Waleed Khan",
    email: "waleed@example.com",
    city: "Multan",
  },
  error: null,
});

const employeeResponse = parseApiResponse(employeeJson, isEmployee);
const productResponse = parseApiResponse(productJson, isProduct);
const customerResponse = parseApiResponse(customerJson, isCustomer);

const retrievedEmployee = handleResponse(employeeResponse);
const retrievedProduct = handleResponse(productResponse);
const retrievedCustomer = handleResponse(customerResponse);

console.log("Retrieved employee:", retrievedEmployee);
console.log("Retrieved product:", retrievedProduct);
console.log("Retrieved customer:", retrievedCustomer);

if (retrievedEmployee) {
  employeeRepo.add(retrievedEmployee);
}
if (retrievedProduct) {
  productRepo.add(retrievedProduct);
}
if (retrievedCustomer) {
  customerRepo.add(retrievedCustomer);
}

console.log("Employee lookup (id 4):", employeeRepo.getById(4));
console.log("Product lookup (id 104):", productRepo.getById(104));
console.log("Customer lookup (id 503):", customerRepo.getById(503));

console.log(
  "Operations employees:",
  employeeRepo.search((emp) => emp.department === "Operations"),
);
console.log(
  "Home products:",
  productRepo.search((p) => p.category === "Home"),
);

setProperty(employeeRepo.getById(1) as Employee, "department", "HR");
console.log(
  "Updated employee 1 department:",
  getProperty(employeeRepo.getById(1) as Employee, "department"),
);

console.log(
  "Employee names:",
  transform(employeeRepo.getAll(), (emp) => `${emp.firstName} ${emp.lastName}`),
);
console.log(
  "Discounted product prices:",
  transform(productRepo.getAll(), (p) => p.price * 0.9),
);

console.log("Employee page 1:", paginate(employeeRepo.getAll(), 1, 2));
console.log("Product page 2:", paginate(productRepo.getAll(), 2, 2));
console.log("Customer page 1:", paginate(customerRepo.getAll(), 1, 5));

const failedResponse: ApiResponse<Employee> = {
  success: false,
  data: null,
  error: "Employee not found",
};
console.log("Failed response result:", handleResponse(failedResponse));

// compiler errors intentionally demonstrated
// getProperty(employeeRepo.getAll()[0], "salary"); // Type error: '"salary"' is not assignable to 'keyof Employee'
// setProperty(productRepo.getAll()[0], "price", "cheap"); // Type error: string is not assignable to number
// employeeRepo.add({ id: 9, name: "Widget", price: 100 }); // Type error: missing firstName/lastName/department

const answer =
  "\nA new entity type can be added without rewriting repository or response logic because MemoryRepository<T extends HasId>, ApiResponse<T>, PaginationResult<T>, transform<T, U>, handleResponse<T>, and getProperty/setProperty<T, K extends keyof T> are all parameterized on the entity type. Adding a Supplier entity only requires a new interface, a new validator, and a new MemoryRepository<Supplier> instance; the shared algorithms remain unchanged.";
console.log(answer);
