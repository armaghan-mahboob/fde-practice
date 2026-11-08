function calculateGrossPayTs(
  basicSalary: number,
  houseAllowance: number,
  transportAllowance: number,
): number {
  return basicSalary + houseAllowance + transportAllowance;
}

function generateSalarySummaryTs(
  name: string,
  basicSalary: number,
  houseAllowance: number,
  transportAllowance: number,
): string {
  const grossSalary = calculateGrossPayTs(
    basicSalary,
    houseAllowance,
    transportAllowance,
  );

  return [
    `Employee: ${name}`,
    `Basic salary: Rs. ${basicSalary}`,
    `Total allowances: Rs. ${houseAllowance + transportAllowance}`,
    `Gross salary: Rs. ${grossSalary}`,
  ].join("\n");
}

const testEmployees: {
  name: string;
  basic: number;
  house: number;
  transport: number;
}[] = [
  { name: "Ali", basic: 70000, house: 10000, transport: 5000 },
  { name: "Sara", basic: 85000, house: 12000, transport: 8000 },
  { name: "Ahmed", basic: 60000, house: 9000, transport: 4000 },
];

testEmployees.forEach((emp) => {
  const result: string = generateSalarySummaryTs(
    emp.name,
    emp.basic,
    emp.house,
    emp.transport,
  );
  console.log(result);
  console.log("----------------------------");
});
