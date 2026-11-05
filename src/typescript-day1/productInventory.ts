type Item = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

function displayProducts(inventory: Item[]): void {
  console.log("Current Inventory:");
  for (const item of inventory) {
    console.log(
      `ID: ${item.id} | ${item.name} | Price: Rs. ${item.price} | Stock: ${item.quantity}`,
    );
  }
  console.log("--------------------");
}

function addStock(inventory: Item[], productId: number, amount: number): void {
  if (amount <= 0) {
    console.log("Error: Added quantity must be positive.");
    return;
  }
  for (const item of inventory) {
    if (item.id === productId) {
      item.quantity += amount;
      console.log(`Added ${amount} units to ${item.name}.`);
      console.log(`Remaining stock: ${item.quantity}`);
      return;
    }
  }
  console.log("Item not found.");
}

function recordSale(
  inventory: Item[],
  productId: number,
  amount: number,
): void {
  if (amount <= 0) {
    console.log("Error: Sale quantity must be positive.");
    return;
  }
  for (const item of inventory) {
    if (item.id === productId) {
      if (amount > item.quantity) {
        console.log(`Sale rejected: insufficient stock.`);
      } else {
        item.quantity -= amount;
        console.log(`Sold ${amount} units of ${item.name}.`);
        console.log(`Remaining stock: ${item.quantity}`);
      }
      return;
    }
  }
  console.log("Item not found.");
}

const myInventory: Item[] = [
  { id: 1, name: "Keyboard", price: 1500, quantity: 10 },
  { id: 2, name: "Mouse", price: 800, quantity: 25 },
  { id: 3, name: "Monitor", price: 15000, quantity: 5 },
  { id: 4, name: "Webcam", price: 4500, quantity: 8 },
];

displayProducts(myInventory);

addStock(myInventory, 1, 10);
recordSale(myInventory, 1, 2);
recordSale(myInventory, 1, 25);

displayProducts(myInventory);
