import { Router } from "express";
// importa todas las funciones del controlador incluyendo la nueva getProductsByCategory
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router(); // crea una instancia del enrutador de Express

categoryRouter.get("/", getAllCategories); // GET /categories → lista todas las categorias

categoryRouter.get("/:id", getCategoryById); // GET /categories/1 → busca una categoria por id

categoryRouter.post("/", createCategory); // POST /categories → crea una categoria nueva

categoryRouter.put("/:id", updateCategory); // PUT /categories/1 → actualiza una categoria existente

categoryRouter.delete("/:id", deleteCategory); // DELETE /categories/1 → elimina si no tiene productos

// ruta relacional que sigue el estandar REST: recurso-padre/:id/recurso-hijo
// GET /categories/1/products → retorna todos los productos de la categoria 1
categoryRouter.get("/:id/products", getProductsByCategory);

export default categoryRouter; // exporta el router para conectarlo en app.js