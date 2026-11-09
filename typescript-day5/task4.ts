interface Employee {
  id: number;
  code: string;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const employeeList: Employee[] = [
  { id: 101, code: "EMP-A1", name: "Ali Khan" },
  { id: 102, code: "EMP-B2", name: "Sana Ahmed" },
];

const productList: Product[] = [
  { id: 1, name: "Laptop", price: 150000 },
  { id: 2, name: "Mouse", price: 2500 },
];

function searchEmployee(id: number): Employee | undefined;
function searchEmployee(code: string): Employee | undefined;
function searchEmployee(searchTerm: number | string): Employee | undefined {
  if (typeof searchTerm === "number") {
    return employeeList.find((e) => e.id === searchTerm);
  } else {
    return employeeList.find((e) => e.code === searchTerm);
  }
}

function searchProduct(id: number): Product | undefined;
function searchProduct(name: string): Product | undefined;
function searchProduct(searchTerm: number | string): Product | undefined {
  if (typeof searchTerm === "number") {
    return productList.find((p) => p.id === searchTerm);
  } else {
    return productList.find((p) => p.name === searchTerm);
  }
}

console.log("--- Employee Searches ---");
console.log("By ID (101):", searchEmployee(101));
console.log("By Code (EMP-B2):", searchEmployee("EMP-B2"));
console.log("Not Found (999):", searchEmployee(999));
console.log("Not Found (EMP-X9):", searchEmployee("EMP-X9"));

console.log("--- Product Searches ---");
console.log("By ID (2):", searchProduct(2));
console.log("By Name (Laptop):", searchProduct("Laptop"));
console.log("Not Found (99):", searchProduct(99));
console.log("Not Found (Keyboard):", searchProduct("Keyboard"));

// searchEmployee(true); // Commented compiler error: No overload matches this call.
// searchProduct({}); // Commented compiler error: No overload matches this call.
