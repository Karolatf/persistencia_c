// MÓDULO: controllers/category.controller.js
// CAPA:   Controllers (lógica de peticiones HTTP)
//
// Responsabilidad ÚNICA: gestionar las peticiones HTTP de categorías,
// incluyendo la regla de integridad al eliminar.
//
// Dependencias:
//   models/category.model.js     (acceso a MySQL para categorías)
//   models/product.model.js      (para verificar productos vinculados)
//   utils/catchAsync.js          (captura de errores asíncronos)
//   utils/response.handler.js    (formato estándar de respuestas)

import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.handler.js";

// GET /categories — Lista todas las categorías
const getAllCategories = catchAsync(async (req, res) => {
  const categories = await CategoryModel.findAll();
  return successResponse(res, 200, "Lista de categorías", categories);
});

// GET /categories/:id — Busca una categoría por su ID
const getCategoryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(Number(id));

  if (!category) {
    const error = new Error(`Categoría con ID ${id} no encontrada`);
    error.statusCode = 404;
    return next(error);
  }

  return successResponse(res, 200, "Categoría encontrada correctamente", category);
});

// POST /categories — Crea una categoría nueva
const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    const error = new Error("El nombre de la categoría es obligatorio");
    error.statusCode = 400;
    return next(error);
  }

  const newCategory = await CategoryModel.create({ name });
  return successResponse(res, 201, "Categoría creada correctamente", newCategory);
});

// PUT /categories/:id — Actualiza una categoría existente
const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedCategory = await CategoryModel.update(Number(id), req.body);

  if (!updatedCategory) {
    const error = new Error(`Categoría con ID ${id} no encontrada`);
    error.statusCode = 404;
    return next(error);
  }

  return successResponse(res, 200, "Categoría actualizada correctamente", updatedCategory);
});

// DELETE /categories/:id — Elimina una categoría con regla de integridad
// No se puede eliminar si tiene productos vinculados (regla de negocio)
const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Paso 1: verificar que la categoría existe antes de cualquier otra operación
  const categoryExists = await CategoryModel.findById(Number(id));
  if (!categoryExists) {
    const error = new Error(
      `No se pudo eliminar: Categoría con ID ${id} no encontrada`
    );
    error.statusCode = 404;
    return next(error);
  }

  // Paso 2: regla de integridad — verificar si hay productos vinculados
  // Si los hay, MySQL igual lo bloquearía por ON DELETE RESTRICT,
  // pero respondemos con 409 antes de intentar el DELETE
  const linkedProducts = await ProductModel.findByCategoryId(Number(id));
  if (linkedProducts && linkedProducts.length > 0) {
    const error = new Error(
      "No se puede eliminar la categoría porque tiene recursos vinculados"
    );
    error.statusCode = 409; // Conflict: viola una regla de negocio
    return next(error);
  }

  // Paso 3: pasó ambas validaciones, procede a eliminar
  await CategoryModel.delete(Number(id));
  return successResponse(res, 200, "Categoría eliminada correctamente");
});

// GET /categories/:id/products — Ruta relacional (estándar REST)
// Retorna todos los productos que pertenecen a una categoría específica
const getProductsByCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Verificamos que la categoría padre existe antes de buscar sus productos
  const categoryExists = await CategoryModel.findById(Number(id));
  if (!categoryExists) {
    const error = new Error(`La categoría con ID ${id} no existe`);
    error.statusCode = 404;
    return next(error);
  }

  const products = await ProductModel.findByCategoryId(Number(id));
  return successResponse(
    res,
    200,
    `Productos de la categoría: ${categoryExists.name}`,
    products
  );
});

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
};