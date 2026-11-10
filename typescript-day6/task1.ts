class Employee {
  readonly id: string;
  readonly name: string;
  readonly department: string;
  readonly monthlySalary: number;

  constructor(
    id: string,
    name: string,
    department: string,
    monthlySalary: number,
  ) {
    this.id = id;
    this.name = name;
    this.department = department;

    if (monthlySalary <= 0) {
      throw new Error("Monthly salary must be greater than zero.");
    }
    this.monthlySalary = monthlySalary;
  }

  calculateAnnualSalary(): number {
    return this.monthlySalary * 12;
  }

  getSummary(): string {
    return `ID: ${this.id}, Name: ${this.name}, Department: ${this.department}, Monthly Salary: PKR ${this.monthlySalary}`;
  }
}

const emp1 = new Employee("PK-001", "Ahmed Khan", "Engineering", 150000);
const emp2 = new Employee("PK-002", "Fatima Ali", "Marketing", 120000);
const emp3 = new Employee("PK-003", "Bilal Hussain", "Human Resources", 95000);

console.log(emp1.getSummary());
console.log(`Annual Salary: PKR ${emp1.calculateAnnualSalary()}`);

console.log(emp2.getSummary());
console.log(`Annual Salary: PKR ${emp2.calculateAnnualSalary()}`);

console.log(emp3.getSummary());
console.log(`Annual Salary: PKR ${emp3.calculateAnnualSalary()}`);

try {
  const invalidEmp = new Employee("PK-004", "Usman Tariq", "Sales", -5000);
} catch (error: any) {
  console.log(`Error: ${error.message}`);
}

// Encapsulation + validation ensure correctness and readability, while three instances demonstrate both the summary and annual salary outputs as required.
