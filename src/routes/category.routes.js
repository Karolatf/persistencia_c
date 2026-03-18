import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

// GET /categories → lista todas
categoryRouter.get("/", getAllCategories);

// GET /categories/:id → busca una por id
categoryRouter.get("/:id", getCategoryById);

// POST /categories → crea una nueva
categoryRouter.post("/", createCategory);

// PUT /categories/:id → actualiza una existente
categoryRouter.put("/:id", updateCategory);

// DELETE /categories/:id → elimina si no tiene productos vinculados
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;