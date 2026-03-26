import pool from "../config/db.js"; // importa el pool de conexiones a mysql

export const CategoryModel = {

  // 1. Consulta todas las categorias de la base de datos
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM categories"); // trae todos los registros
    return rows; // retorna el arreglo completo
  },

  // 2. Busca una categoria por su id
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
    return rows[0]; // retorna el primer resultado, undefined si no existe
  },

  // 3. Inserta una nueva categoria en la base de datos
  create: async (newCategory) => {
    const { name } = newCategory; // extrae el nombre del objeto recibido
    const [result] = await pool.query("INSERT INTO categories (name) VALUES (?)", [name]);
    
    // result.insertId contiene el ID autogenerado por MySQL
    const [createdCategory] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [result.insertId],
    );
    return createdCategory[0];
  },

  // 4. Actualizar una categoría
  update: async (id, updatedFields) => {
    const { name } = updatedFields;
    const [result] = await pool.query(
      "UPDATE categories SET name = ? WHERE id = ?",
      [name, id],
    );

    // Si affectedRows es 0, significa que el ID no existía
    if (result.affectedRows === 0) return null;

    // Buscamos cómo quedó el registro después de actualizarlo
    const [updatedCategory] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [id],
    );
    return updatedCategory[0];
  },

  // 5. Elimina una categoria de la base de datos por su id
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    return result.affectedRows > 0; // true si se elimino, false si no existia
  },
};