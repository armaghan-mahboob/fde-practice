interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  department?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category?: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  city?: string;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

function filterByProperty<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K],
): T[] {
  return items.filter((item) => item[key] === value);
}

const employee: Employee = {
  id: 1,
  firstName: "Sadia",
  lastName: "Rehman",
  department: "Finance",
};

const product: Product = {
  id: 101,
  name: "Refrigerator",
  price: 95000,
};

const customer: Customer = {
  id: 501,
  name: "Kamran Shah",
  email: "kamran@example.com",
};

const employees: Employee[] = [
  { id: 1, firstName: "Sadia", lastName: "Rehman", department: "Finance" },
  { id: 2, firstName: "Tariq", lastName: "Javed", department: "Sales" },
  { id: 3, firstName: "Mahnoor", lastName: "Siddiqui", department: "Finance" },
];

const products: Product[] = [
  { id: 101, name: "Refrigerator", price: 95000, category: "Home" },
  { id: 102, name: "Iron", price: 3500, category: "Home" },
  { id: 103, name: "Smartphone", price: 60000, category: "Electronics" },
];

console.log("Employee firstName:", getProperty(employee, "firstName"));
console.log("Employee department:", getProperty(employee, "department"));
console.log("Product price:", getProperty(product, "price"));
console.log("Customer email:", getProperty(customer, "email"));

setProperty(employee, "department", "Audit");
setProperty(product, "price", 89999);
setProperty(customer, "city", "Lahore");

console.log("Updated employee:", employee);
console.log("Updated product:", product);
console.log("Updated customer:", customer);

console.log(
  "Employees in Finance:",
  filterByProperty(employees, "department", "Finance"),
);
console.log(
  "Products in Home:",
  filterByProperty(products, "category", "Home"),
);
console.log("Employee with id 2:", filterByProperty(employees, "id", 2));

// invalid key value test
// getProperty(employee, "salary"); // Type error: Argument of type '"salary"' is not assignable to parameter of type 'keyof Employee'
// setProperty(product, "category", 5000); // Type error: Argument of type 'number' is not assignable to parameter of type 'string | undefined'

console.log(
  "\nsetProperty(employee, 'name', 5000) fails because 'name' is not a key of Employee, and even if it were, 5000 is not assignable to the value type at that key. A string name succeeds when the key exists on the type and the value matches T[K]; the constraint K extends keyof T ties the value parameter type directly to the property type.",
);
