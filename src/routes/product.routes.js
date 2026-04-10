// MÓDULO: routes/product.routes.js
// CAPA:   Routes
//
// Actualización: POST y PUT ahora pasan primero por validateSchema(productSchema).
// Si el body no cumple el molde, la petición se rechaza aquí con 400
// sin que el controlador se ejecute.
//
// Dependencias:
//   controllers/product.controller.js
//   middlewares/validator.middleware.js
//   schemas/product.schema.js

import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { productSchema } from "../schemas/product.schema.js";

const productRouter = Router();

// GET no necesita validación de body
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);

// POST y PUT: primero valida el body con Zod, luego llama al controlador
productRouter.post("/", validateSchema(productSchema), createProduct);
productRouter.put("/:id", validateSchema(productSchema), updateProduct);

// DELETE no necesita validación de body
productRouter.delete("/:id", deleteProduct);

export default productRouter;