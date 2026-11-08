const employee: {
  id: number;
  name: string;
  salary: number;
  isActive: boolean;
} = {
  id: 101,
  name: "Hira",
  salary: 78000,
  isActive: true,
};

console.log(
  `Employee #${employee.id}: ${employee.name} | Salary: ${employee.salary} | Active: ${employee.isActive}`,
);

// employee.id = "101";
// employee.salary = "78000";
// employee.isActive = "true";

employee.salary = 82000;
employee.isActive = false;

console.log(
  `Updated salary: ${employee.salary} | Active: ${employee.isActive}`,
);
