// MÓDULO: controllers/product.controller.js
// CAPA:   Controllers
//
// Actualización: se usa category_id (no categori_id).
// Las validaciones manuales de campos se eliminaron porque
// validateSchema(productSchema) ya las hace en la ruta.
//
// Dependencias:
//   models/product.model.js
//   utils/catchAsync.js
//   utils/response.handler.js

import { ProductModel } from "../models/product.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.handler.js";

// GET /products
const getAllProducts = catchAsync(async (req, res) => {
  const products = await ProductModel.findAll();
  return successResponse(res, 200, "Lista de productos", products);
});

// GET /products/:id
const getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findById(Number(id));

  if (!product) {
    const error = new Error(`Producto con ID ${id} no encontrado`);
    error.statusCode = 404;
    return next(error);
  }

  return successResponse(res, 200, "Producto encontrado correctamente", product);
});

// POST /products
// req.body ya fue validado y limpiado por validateSchema(productSchema)
const createProduct = catchAsync(async (req, res) => {
  const { name, category_id, price } = req.body;
  const newProduct = await ProductModel.create({ name, category_id, price });
  return successResponse(res, 201, "Producto creado correctamente", newProduct);
});

// PUT /products/:id
// req.body ya fue validado por validateSchema(productSchema)
const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedProduct = await ProductModel.update(Number(id), req.body);

  if (!updatedProduct) {
    const error = new Error(`Producto con ID ${id} no encontrado`);
    error.statusCode = 404;
    return next(error);
  }

  return successResponse(res, 200, "Producto actualizado correctamente", updatedProduct);
});

// DELETE /products/:id
const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const isDeleted = await ProductModel.delete(Number(id));

  if (!isDeleted) {
    const error = new Error(
      `No se pudo eliminar: Producto con ID ${id} no encontrado`
    );
    error.statusCode = 404;
    return next(error);
  }

  return successResponse(res, 200, "Producto eliminado correctamente");
});

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };