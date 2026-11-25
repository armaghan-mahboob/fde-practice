import { Product, ProductInput, ProductUpdate } from "../types";

let products: Product[] = [];

export const getAllProducts = (
  search?: string,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
): Product[] => {
  let result = [...products];

  if (search) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (minPrice !== undefined) {
    result = result.filter((p) => p.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    result = result.filter((p) => p.price <= maxPrice);
  }

  return result;
};

export const getProductById = (id: number): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const createProduct = (data: ProductInput): Product => {
  const newProduct: Product = {
    id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    ...data,
  };
  products.push(newProduct);
  return newProduct;
};

export const updateProduct = (
  id: number,
  data: ProductUpdate,
): Product | null => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedProduct = { ...products[index], ...data };
  products[index] = updatedProduct;
  return updatedProduct;
};

export const deleteProduct = (id: number): boolean => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products = products.filter((p) => p.id !== id);
  return true;
};

export const updateStock = (id: number, quantity: number): Product | null => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const newStock = products[index].stock + quantity;

  if (newStock < 0) {
    throw new Error("Stock cannot be negative");
  }

  products[index].stock = newStock;
  return products[index];
};

export const getInventoryStats = () => {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return { totalProducts, totalValue, outOfStockCount };
};

export const getOutOfStock = (): Product[] => {
  return products.filter((p) => p.stock === 0);
};
