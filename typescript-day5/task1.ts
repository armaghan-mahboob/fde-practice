interface Employee {
  readonly id: number;
  name: string;
  monthlySalary: number;
}

type SalaryAdjustment = (employee: Employee, amount: number) => number;

const employees: Employee[] = [
  { id: 1, name: "Ali Khan", monthlySalary: 85000 },
  { id: 2, name: "Sana Ahmed", monthlySalary: 120000 },
  { id: 3, name: "Bilal Hussain", monthlySalary: 95000 },
];

function calculateAnnualSalary(
  employee: Employee,
  adjust: SalaryAdjustment,
): number {
  const adjustedMonthly = adjust(employee, employee.monthlySalary);
  return adjustedMonthly * 12;
}

const bonusAdjustment: SalaryAdjustment = (employee, amount) => amount + 10000;

employees.forEach((employee) => {
  const adjustedAnnual = calculateAnnualSalary(employee, bonusAdjustment);
  console.log(
    `Name: ${employee.name}, Monthly Salary: PKR ${employee.monthlySalary}, Adjusted Annual Salary: PKR ${adjustedAnnual}`,
  );
});

// const invalidCall: number = calculateAnnualSalary("Ali Khan", bonusAdjustment); // Commented compiler error: Argument of type 'string' is not assignable to parameter of type 'Employee'.
