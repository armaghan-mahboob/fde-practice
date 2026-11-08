const products: {
  readonly id: number;
  name: string;
  price: number;
  quantity: number;
}[] = [
  { id: 1, name: "Laptop", price: 1000, quantity: 50 },
  { id: 2, name: "Mouse", price: 50, quantity: 1000 },
  { id: 3, name: "Keyboard", price: 100, quantity: 250 },
];

const calculateInventoryValue = (items: typeof products): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

let initialValue = calculateInventoryValue(products);
console.log(`Initial inventory value: ${initialValue}`);

// products[0].id = 10;
// products[0].price = "1200";
// products[0].quantity = "60";

products[0].quantity += 50;

let updatedValue = calculateInventoryValue(products);
console.log(`Updated inventory value: ${updatedValue}`);
