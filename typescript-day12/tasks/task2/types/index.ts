export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
}

export type ProductInput = Omit<Product, "id">;

export type ProductUpdate = Partial<ProductInput>;

export type ApiError = {
  message: string;
};
