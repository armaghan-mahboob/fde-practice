type Product = {
  readonly id: number;
  name: string;
  price: number;
};

type InventoryDetails = {
  quantity: number;
  warehouse: string;
};

type StockedProduct = Product & InventoryDetails;

const inventory: StockedProduct[] = [
  { id: 1, name: "Keyboard", price: 5000, quantity: 10, warehouse: "A" },
  { id: 2, name: "Mouse", price: 2500, quantity: 20, warehouse: "B" },
  { id: 3, name: "Monitor", price: 10000, quantity: 2, warehouse: "A" },
];

function calculateTotalValue(products: StockedProduct[]): number {
  return products.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );
}

console.log(`Initial inventory value: PKR ${calculateTotalValue(inventory)}`);

inventory[0].quantity = 11;

console.log(`Updated inventory value: PKR ${calculateTotalValue(inventory)}`);

/*
// A union would not represent the combined record correctly:
type UnionProduct = Product | InventoryDetails;
// Accessing both catalogue and stock fields on a union is a compiler error:

const item: UnionProduct = {
  id: 4,
  name: "Cable",
  price: 1000,
  quantity: 5,
  warehouse: "C",
};
// Object literal may only specify known properties, and 'quantity' does not exist in type 'Product'.

const unionItem: UnionProduct = {
  id: 4,
  name: "Cable",
  price: 1000,
};
// console.log(unionItem.quantity);
// Property 'quantity' does not exist on type 'UnionProduct'.
//   Property 'quantity' does not exist on type 'Product'.
*/
