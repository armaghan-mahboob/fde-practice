interface Employee {
  id: number;
  name: string;
  isActive: boolean;
}

type EmployeeProcessor = (employee: Employee) => string;
type NotificationCallback = (message: string) => void;
type ValidationCallback = (employee: Employee) => string;

function processEmployee(
  employee: Employee,
  processor: EmployeeProcessor,
): string {
  return processor(employee);
}

function processEmployees(
  employees: Employee[],
  processor: EmployeeProcessor,
  notifier: NotificationCallback,
  validator: ValidationCallback,
): void {
  for (const employee of employees) {
    const validationResult = validator(employee);
    if (validationResult === "Valid") {
      const result = processEmployee(employee, processor);
      notifier(result);
    } else {
      notifier(`Validation failed for ${employee.name}: ${validationResult}`);
    }
  }
}

const emailNotification: NotificationCallback = (message) => {
  console.log(`[Email Sent] ${message}`);
};

const smsNotification: NotificationCallback = (message) => {
  console.log(`[SMS Sent] ${message}`);
};

const activeValidation: ValidationCallback = (employee) => {
  return employee.isActive ? "Valid" : "Inactive";
};

const standardProcessor: EmployeeProcessor = (employee) => {
  return `Processed employee: ${employee.name}`;
};

const employees: Employee[] = [
  { id: 1, name: "Ali Khan", isActive: true },
  { id: 2, name: "Sana Ahmed", isActive: false },
  { id: 3, name: "Bilal Hussain", isActive: true },
];

console.log("--- Processing with Email Notification ---");
processEmployees(
  employees,
  standardProcessor,
  emailNotification,
  activeValidation,
);

console.log("--- Processing with SMS Notification ---");
processEmployees(
  employees,
  standardProcessor,
  smsNotification,
  activeValidation,
);
