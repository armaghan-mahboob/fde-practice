interface HasId {
  id: number;
}

interface Employee extends HasId {
  firstName: string;
  lastName: string;
  department: string;
}

interface Product extends HasId {
  name: string;
  price: number;
  category: string;
}

interface Customer extends HasId {
  name: string;
  email: string;
  city: string;
}

function getEntityId<T extends HasId>(entity: T): number {
  return entity.id;
}

function findById<T extends HasId>(entities: T[], id: number): T | undefined {
  return entities.find((entity) => entity.id === id);
}

function processEntities<T extends HasId>(
  entities: T[],
): { ids: number[]; records: T[] } {
  const ids = entities.map((entity) => entity.id);
  const records = entities.filter((entity) => entity.id > 0);
  return { ids, records };
}

const employees: Employee[] = [
  { id: 1, firstName: "Areeba", lastName: "Shaikh", department: "HR" },
  {
    id: 2,
    firstName: "Danish",
    lastName: "Qureshi",
    department: "Engineering",
  },
];

const products: Product[] = [
  { id: 101, name: "Microwave Oven", price: 25000, category: "Appliances" },
  { id: 102, name: "Water Dispenser", price: 18000, category: "Appliances" },
];

const customers: Customer[] = [
  { id: 501, name: "Nadia Aslam", email: "nadia@example.com", city: "Karachi" },
  {
    id: 502,
    name: "Imran Baig",
    email: "imran@example.com",
    city: "Islamabad",
  },
];

console.log("Employee IDs:", processEntities(employees).ids);
console.log("Product IDs:", processEntities(products).ids);
console.log("Customer IDs:", processEntities(customers).ids);

console.log("Employee lookup (id 2):", findById(employees, 2));
console.log("Product lookup (id 101):", findById(products, 101));
console.log("Customer lookup (id 502):", findById(customers, 502));

console.log("Employee record 1 id:", getEntityId(employees[0]));
console.log("Product record 1 id:", getEntityId(products[0]));
console.log("Customer record 1 id:", getEntityId(customers[0]));

// one entity lacking id and why it fails
// const invalidEntity = { name: "Ledger" };
// getEntityId(invalidEntity); // Type error: argument of type '{ name: string; }' is not assignable to parameter of type 'HasId'; property 'id' is missing

console.log(
  "\nT retains entity-specific fields because the constraint T extends HasId only narrows T to include an id for the shared algorithm, while T itself remains the full concrete type (Employee, Product, Customer). Returning T | undefined from findById and T[] from processEntities preserves every extra field, unlike returning HasId which would strip them to only { id: number }.",
);
