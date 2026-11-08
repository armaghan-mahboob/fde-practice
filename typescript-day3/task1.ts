type Employee = {
  id: number;
  name: string;
  role: string;
  salary: number;
};

interface EmployeeContact {
  email?: string;
  phone?: string;
}

type EmployeeRecord = Employee & {
  contact?: EmployeeContact;
};

const employees: EmployeeRecord[] = [
  {
    id: 101,
    name: "Hira",
    role: "Engineering",
    salary: 78000,
    contact: { email: "hira@company.com" },
  },
  {
    id: 102,
    name: "Omar",
    role: "Sales",
    salary: 85000,
    contact: { phone: "+92-300-1234567" },
  },
  {
    id: 103,
    name: "Sara",
    role: "Marketing",
    salary: 65000,
  },
];

function displayRecord(employee: EmployeeRecord): void {
  const contactInfo = employee.contact
    ? ` | Contact: ${employee.contact.email ?? employee.contact.phone ?? "N/A"}`
    : " | Contact: N/A";
  console.log(
    `Employee #${employee.id}: ${employee.name} | ${employee.role} | PKR ${employee.salary}${contactInfo}`,
  );
}

function calculateMonthlyPayroll(employeeList: Employee[]): number {
  return employeeList.reduce((total, employee) => total + employee.salary, 0);
}

employees.forEach(displayRecord);
console.log(`Monthly payroll: PKR ${calculateMonthlyPayroll(employees)}`);

/*
// Invalid assignment (compiler error example):

const invalidEmployee: Employee = {
  id: "101",
  name: "Hira",
  role: "Engineering",
  salary: 78000,
};

// Type 'string' is not assignable to type 'number'.

const invalidContact: EmployeeContact = {
  email: 12345,
};

// Type 'number' is not assignable to type 'string'.
*/
