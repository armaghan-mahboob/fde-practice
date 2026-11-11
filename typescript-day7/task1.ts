interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

function processItems<T>(items: T[]): { count: number; items: T[] } {
  return {
    count: items.length,
    items: items,
  };
}

function getEmployeeName<T extends { firstName: string; lastName: string }>(
  employee: T,
): string {
  return `${employee.firstName} ${employee.lastName}`;
}

function findEmployeeById<T extends { id: number }>(
  employees: T[],
  id: number,
): T | undefined {
  return employees.find((emp) => emp.id === id);
}

const employees: Employee[] = [
  { id: 1, firstName: "Ahmed", lastName: "Khan" },
  { id: 2, firstName: "Fatima", lastName: "Malik" },
  { id: 3, firstName: "Bilal", lastName: "Hussain" },
];

const names: string[] = ["Ali", "Sana", "Usman"];

const employeeResult = processItems<Employee>(employees);
const nameResult = processItems<string>(names);

console.log("Employee names:", employees.map(getEmployeeName));
console.log("Employee count:", employeeResult.count);
console.log("Selected employee:", findEmployeeById(employees, 1));

// valid call
const inferredEmployee = findEmployeeById(employees, 2);
console.log("Inferred type selected employee:", inferredEmployee);

// invalid call
// const invalidCall = findEmployeeById(employees, "1");

// demonstrate inferred types in editor/compiler
console.log("employeeResult inferred:", employeeResult);
console.log("nameResult inferred:", nameResult);
