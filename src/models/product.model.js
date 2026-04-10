// MÓDULO: models/product.model.js
// CAPA:   Models (acceso directo a MySQL)
//
// Correcciones respecto al código del profesor:
//   - Se usa category_id (no categori_id) en todas las queries
//   - Se corrigió el bug en update: faltaba coma y price en los parámetros
//
// Dependencias: config/db.js

import pool from "../config/db.js";

export const ProductModel = {

  // Retorna todos los productos
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM products");
    return rows;
  },

  // Busca un producto por ID; retorna undefined si no existe
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // Busca todos los productos de una categoría
  // Usado por deleteCategory para verificar integridad antes de borrar
  findByCategoryId: async (categoryId) => {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE category_id = ?",
      [categoryId]
    );
    return rows;
  },

  // Inserta un producto y retorna el registro completo con su ID generado
  create: async (newProduct) => {
    const { name, category_id, price } = newProduct;

    const [result] = await pool.query(
      "INSERT INTO products (name, price, stock, category_id) VALUES (?, ?, ?, ?)",
      [name, price, 5, category_id] // stock por defecto 5 igual que la tabla
    );

    const [createdProduct] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId]
    );
    return createdProduct[0];
  },

  // Actualiza un producto existente
  // BUG CORREGIDO del profesor: faltaba la coma entre category_id y price,
  // y price no estaba en el arreglo de parámetros
  update: async (id, updatedFields) => {
    const { name, category_id, price } = updatedFields;

    const [result] = await pool.query(
      "UPDATE products SET name = ?, category_id = ?, price = ? WHERE id = ?",
      [name, category_id, price, id] // id va al final para el WHERE
    );

    // affectedRows = 0 significa que el ID no existe en la tabla
    if (result.affectedRows === 0) return null;

    const [updatedProduct] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    return updatedProduct[0];
  },

  // Elimina un producto; retorna true si se eliminó, false si no existía
  delete: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM products WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};