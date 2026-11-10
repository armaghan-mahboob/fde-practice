class Employee {
  readonly id: string;
  readonly name: string;
  protected salary: number;

  constructor(id: string, name: string, salary: number) {
    if (salary <= 0) {
      throw new Error("Salary must be greater than zero.");
    }
    this.id = id;
    this.name = name;
    this.salary = salary;
  }

  describeRole(): string {
    return `Employee: ${this.name} (ID: ${this.id}), Salary: PKR ${this.salary}`;
  }
}

class Manager extends Employee {
  readonly department: string;

  constructor(id: string, name: string, salary: number, department: string) {
    super(id, name, salary);
    if (department.trim() === "") {
      throw new Error("Department cannot be empty.");
    }
    this.department = department;
  }

  describeRole(): string {
    return `Manager: ${this.name} (ID: ${this.id}), Department: ${this.department}, Salary: PKR ${this.salary}`;
  }
}

class Developer extends Employee {
  readonly programmingLanguage: string;

  constructor(
    id: string,
    name: string,
    salary: number,
    programmingLanguage: string,
  ) {
    super(id, name, salary);
    if (programmingLanguage.trim() === "") {
      throw new Error("Programming language cannot be empty.");
    }
    this.programmingLanguage = programmingLanguage;
  }

  describeRole(): string {
    return `Developer: ${this.name} (ID: ${this.id}), Language: ${this.programmingLanguage}, Salary: PKR ${this.salary}`;
  }
}

const employees: Employee[] = [
  new Employee("PK-E01", "Ahmed Khan", 80000),
  new Manager("PK-M01", "Fatima Ali", 150000, "Engineering"),
  new Developer("PK-D01", "Bilal Hussain", 120000, "TypeScript"),
  new Manager("PK-M02", "Zainab Raza", 160000, "Marketing"),
  new Developer("PK-D02", "Usman Tariq", 110000, "Python"),
];

console.log("--- Role-Specific Outputs (Polymorphism) ---");
employees.forEach((emp) => {
  console.log(emp.describeRole());
});

console.log("\n--- Invalid Cases ---");
try {
  new Employee("PK-E02", "Invalid Emp", -1000);
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

try {
  new Developer("PK-D03", "Invalid Dev", 90000, " ");
} catch (error: any) {
  console.log(`Rejected: ${error.message}`);
}

/*
 * SHORT DESIGN EXPLANATION
 *
 * OOP Choice (is-a / has-a decisions):
 * - `Manager` and `Developer` both "is-a" `Employee`, so they extend the `Employee` class.
 *   This is the correct choice because they share the core identity and state (id, name,
 *   salary) of an employee, but add role-specific properties.
 * - "has-a" is used for their specific data: a Manager has-a department (string), and a
 *   Developer has-a programming language (string).
 * - Storing mixed children in `Employee[]` demonstrates polymorphism: the `describeRole()`
 *   method is overridden in each subclass, so iterating the array produces role-specific
 *   output without needing type checks.
 *
 * Encapsulation:
 * - `id` and `name` are `readonly`, ensuring identity cannot be mutated.
 * - `salary` is `protected`, allowing subclasses to access it (needed for the overridden
 *   `describeRole()` methods) while preventing direct external modification.
 * - Validation in constructors ensures invalid objects (negative salary, empty strings)
 *   cannot be instantiated.
 */
