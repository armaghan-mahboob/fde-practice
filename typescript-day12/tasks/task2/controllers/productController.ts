import { Request, Response } from "express";
import * as productService from "../services/productService";
import { ProductInput, ProductUpdate, ApiError } from "../types";

export const getProducts = (req: Request, res: Response) => {
  const { search, category, minPrice, maxPrice } = req.query;
  const products = productService.getAllProducts(
    search as string,
    category as string,
    minPrice ? Number(minPrice) : undefined,
    maxPrice ? Number(maxPrice) : undefined,
  );
  res.status(200).json(products);
};

export const getProduct = (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" } as ApiError);
  }

  const product = productService.getProductById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" } as ApiError);
  }

  res.status(200).json(product);
};

export const createProduct = (req: Request, res: Response) => {
  const { name, price, category, description, stock } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res
      .status(400)
      .json({ message: "Name is required and must be a string" } as ApiError);
  }
  if (price === undefined || typeof price !== "number" || price < 0) {
    return res
      .status(400)
      .json({
        message: "Price is required and must be a positive number",
      } as ApiError);
  }
  if (!category || typeof category !== "string") {
    return res
      .status(400)
      .json({ message: "Category is required" } as ApiError);
  }
  if (!description || typeof description !== "string") {
    return res
      .status(400)
      .json({ message: "Description is required" } as ApiError);
  }
  if (
    stock === undefined ||
    typeof stock !== "number" ||
    stock < 0 ||
    !Number.isInteger(stock)
  ) {
    return res
      .status(400)
      .json({
        message: "Stock is required and must be a positive integer",
      } as ApiError);
  }

  const newProduct = productService.createProduct({
    name,
    price,
    category,
    description,
    stock,
  });
  res.status(201).json(newProduct);
};

export const updateProduct = (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" } as ApiError);
  }

  const updateData: ProductUpdate = req.body;

  if (
    updateData.price !== undefined &&
    (typeof updateData.price !== "number" || updateData.price < 0)
  ) {
    return res
      .status(400)
      .json({ message: "Price must be a positive number" } as ApiError);
  }
  if (
    updateData.stock !== undefined &&
    (typeof updateData.stock !== "number" || updateData.stock < 0)
  ) {
    return res
      .status(400)
      .json({ message: "Stock cannot be negative" } as ApiError);
  }

  const updatedProduct = productService.updateProduct(id, updateData);
  if (!updatedProduct) {
    return res.status(404).json({ message: "Product not found" } as ApiError);
  }

  res.status(200).json(updatedProduct);
};

export const deleteProduct = (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" } as ApiError);
  }

  const success = productService.deleteProduct(id);
  if (!success) {
    return res.status(404).json({ message: "Product not found" } as ApiError);
  }

  res.status(204).send();
};

export const updateStock = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" } as ApiError);
  }

  const { quantity } = req.body;
  if (
    quantity === undefined ||
    typeof quantity !== "number" ||
    !Number.isInteger(quantity)
  ) {
    return res
      .status(400)
      .json({ message: "Quantity must be an integer" } as ApiError);
  }

  try {
    const updatedProduct = productService.updateStock(id, quantity);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" } as ApiError);
    }
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    if (error.message === "Stock cannot be negative") {
      return res.status(400).json({ message: error.message } as ApiError);
    }
    res.status(500).json({ message: "Internal server error" } as ApiError);
  }
};

export const getStats = (req: Request, res: Response) => {
  const stats = productService.getInventoryStats();
  res.status(200).json(stats);
};

export const getOutOfStock = (req: Request, res: Response) => {
  const products = productService.getOutOfStock();
  res.status(200).json(products);
};
