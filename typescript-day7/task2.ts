interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface InventoryItem {
  sku: string;
  quantity: number;
  warehouse: string;
}

function addItem<T>(list: T[], item: T): T[] {
  return [...list, item];
}

function listItems<T>(list: T[]): T[] {
  return list;
}

function countItems<T>(list: T[]): number {
  return list.length;
}

function getLowStockItems<T extends { quantity: number }>(
  items: T[],
  threshold: number,
): T[] {
  return items.filter((item) => item.quantity < threshold);
}

const products: Product[] = [];
const inventory: InventoryItem[] = [];

const p1: Product = {
  id: 1,
  name: "Laptop",
  price: 150000,
  category: "Electronics",
};
const p2: Product = {
  id: 2,
  name: "Chair",
  price: 12000,
  category: "Furniture",
};

const i1: InventoryItem = { sku: "SKU-001", quantity: 5, warehouse: "Karachi" };
const i2: InventoryItem = { sku: "SKU-002", quantity: 50, warehouse: "Lahore" };
const i3: InventoryItem = {
  sku: "SKU-003",
  quantity: 2,
  warehouse: "Islamabad",
};

const updatedProducts = addItem(addItem(products, p1), p2);
const updatedInventory = addItem(addItem(addItem(inventory, i1), i2), i3);

console.log("All products:", listItems(updatedProducts));
console.log("Total product count:", countItems(updatedProducts));
console.log("Low-stock products:", getLowStockItems(updatedInventory, 10));

// invalid record rejection (without comments)
// invalidRecord: Product = { id: 3, name: "Table" } // Type error: missing price and category
// invalidInventory: InventoryItem = { sku: "SKU-004", warehouse: "Quetta" } // Type error: missing quantity
