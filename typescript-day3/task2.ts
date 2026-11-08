// Sir, renamed "Worker" interface to "WorkerProfile" to avoid conflict with the built-in Worker type in TypeScript.

// Error while using "Worker" as interface name:
//      "Type '{ id: number; name: string; salary: number; department: string; email: string; }' is missing the following properties from type 'Worker': postMessage, terminate, addEventListener, removeEventListener, and 4 more."

interface Person {
  id: number;
  name: string;
}

interface Contact {
  email: string;
}

interface Employee extends Person {
  salary: number;
  department: string;
}

interface Manager extends Employee {
  teamSize: number;
}

interface WorkerProfile extends Employee, Contact {}

function displayEmployee(employee: Employee): void {
  console.log(
    `Employee: ${employee.id} — ${employee.name} — ${employee.department}`,
  );
}

function displayManager(manager: Manager): void {
  console.log(
    `Manager: ${manager.id} — ${manager.name} — ${manager.department} — Team size ${manager.teamSize}`,
  );
}

const employee1: Employee = {
  id: 201,
  name: "Areeba",
  salary: 75000,
  department: "Engineering",
};

const employee2: WorkerProfile = {
  id: 202,
  name: "Hamza",
  salary: 68000,
  department: "Sales",
  email: "hamza@company.com",
};

const manager1: Manager = {
  id: 301,
  name: "Bilal",
  salary: 120000,
  department: "Operations",
  teamSize: 8,
};

displayEmployee(employee1);
displayManager(manager1);

/*
// Incorrect object shape (compiler error example):

const incorrectManager: Manager = {
  id: 302,
  name: "Zara",
  salary: 95000,
  department: "HR",
  // Property 'teamSize' is missing in type '{ id: number; name: string; salary: number; department: string; }' but required in type 'Manager'.
};
*/
