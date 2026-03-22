import pool from "../config/db.js"; // importa el pool de conexiones a mysql

export const CategoryModel = {

  // consulta todas las categorias de la base de datos
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM categories"); // trae todos los registros
    return rows; // retorna el arreglo completo
  },

  // busca una categoria por su id
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
    return rows[0]; // retorna el primer resultado, undefined si no existe
  },

  // inserta una nueva categoria en la base de datos
  create: async (newCategory) => {
    const { name } = newCategory; // extrae el nombre del objeto recibido
    const [result] = await pool.query("INSERT INTO categories (name) VALUES (?)", [name]);
    // retorna la categoria recien creada buscandola por el id generado por mysql
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  // actualiza el nombre de una categoria existente
  update: async (id, updatedFields) => {
    const { name } = updatedFields; // extrae el nombre del objeto recibido
    await pool.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
    // retorna la categoria actualizada
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
    return rows[0]; // undefined si no existia el id
  },

  // elimina una categoria de la base de datos por su id
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    return result.affectedRows > 0; // true si se elimino, false si no existia
  },
};