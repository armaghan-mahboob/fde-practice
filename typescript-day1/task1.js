function calculateGrossPay(basicSalary, houseAllowance, transportAllowance) {
  if (
    typeof basicSalary !== "number" ||
    typeof houseAllowance !== "number" ||
    typeof transportAllowance !== "number"
  ) {
    throw new Error("All salary and allowance inputs must be numbers.");
  }

  return basicSalary + houseAllowance + transportAllowance;
}

function generateSalarySummary(
  name,
  basicSalary,
  houseAllowance,
  transportAllowance,
) {
  const grossSalary = calculateGrossPay(
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

const employees = [
  { name: "Ali", basic: 70000, house: 10000, transport: 5000 },
  { name: "Sara", basic: 85000, house: 12000, transport: 8000 },
  { name: "Ahmed", basic: 60000, house: 9000, transport: 4000 },
];

employees.forEach((emp) => {
  const summary = generateSalarySummary(
    emp.name,
    emp.basic,
    emp.house,
    emp.transport,
  );
  console.log(summary);
  console.log("----------------------------");
});
