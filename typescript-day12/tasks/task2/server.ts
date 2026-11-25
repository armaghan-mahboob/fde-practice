import express, { Request, Response, NextFunction } from "express";
import productRoutes from "./routes/productRoutes";
import { ApiError } from "./types";

const app = express();
app.use(express.json());

app.use("/api/products", productRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" } as ApiError);
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
