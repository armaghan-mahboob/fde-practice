interface HasId {
  id: number;
}

interface Repository<T extends HasId> {
  add(item: T): void;
  getAll(): T[];
  getById(id: number): T | undefined;
  remove(id: number): boolean;
}

class MemoryRepository<T extends HasId> implements Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    if (this.getById(item.id) !== undefined) {
      throw new Error(`Item with id ${item.id} already exists`);
    }
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items];
  }

  getById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  remove(id: number): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    this.items.splice(index, 1);
    return true;
  }
}

interface Employee extends HasId {
  firstName: string;
  lastName: string;
}

interface Product extends HasId {
  name: string;
  price: number;
}

const employeeRepo = new MemoryRepository<Employee>();
const productRepo = new MemoryRepository<Product>();

employeeRepo.add({ id: 1, firstName: "Zainab", lastName: "Iqbal" });
employeeRepo.add({ id: 2, firstName: "Omar", lastName: "Farooq" });

productRepo.add({ id: 1, name: "Air Conditioner", price: 120000 });
productRepo.add({ id: 2, name: "Ceiling Fan", price: 6500 });

console.log("All employees:", employeeRepo.getAll());
console.log("Employee lookup (id 1):", employeeRepo.getById(1));
console.log("Employee lookup (id 99):", employeeRepo.getById(99));

console.log("All products:", productRepo.getAll());
console.log("Product lookup (id 2):", productRepo.getById(2));
console.log("Product lookup (id 99):", productRepo.getById(99));

console.log("Remove employee 2:", employeeRepo.remove(2));
console.log("Remove employee 2 again:", employeeRepo.remove(2));
console.log("All employees after removal:", employeeRepo.getAll());

// invalid insertion
// employeeRepo.add({ id: 3, name: "Fan", price: 5000 }); // Type error: object literal lacks firstName and lastName, and has extra price
// productRepo.add({ id: 3, firstName: "Ali", lastName: "Khan" }); // Type error: object literal lacks name and price, and has extra firstName and lastName

console.log(
  "\nCommon behavior across every entity repository: storage, add, list, lookup by id, and removal by id. Entity-specific behavior: the concrete fields on Employee and Product; the repository never reads them.",
);
