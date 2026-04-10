// MÓDULO: routes/category.routes.js
// CAPA:   Routes
//
// Actualización: POST y PUT ahora pasan por validateSchema(categorySchema).
//
// Dependencias:
//   controllers/category.controller.js
//   middlewares/validator.middleware.js
//   schemas/category.schema.js

import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
} from "../controllers/category.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { categorySchema } from "../schemas/category.schema.js";

const categoryRouter = Router();

// GET y DELETE no necesitan validación de body
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);

// POST y PUT: primero valida con Zod, luego llama al controlador
categoryRouter.post("/", validateSchema(categorySchema), createCategory);
categoryRouter.put("/:id", validateSchema(categorySchema), updateCategory);

categoryRouter.delete("/:id", deleteCategory);

// Ruta relacional REST estándar
categoryRouter.get("/:id/products", getProductsByCategory);

export default categoryRouter;