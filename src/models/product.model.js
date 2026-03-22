import pool from "../config/db.js"; // importa el pool de conexiones a mysql

export const ProductModel = {

  // consulta todos los productos de la base de datos
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM products"); // ejecuta el SELECT y desestructura el resultado
    return rows; // retorna el arreglo de productos
  },

  // busca un producto por su id en la base de datos
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]); // el ? evita SQL injection
    return rows[0]; // retorna solo el primer resultado, undefined si no existe
  },

  // busca todos los productos que pertenecen a una categoria
  findByCategoryId: async (categoryId) => {
    const [rows] = await pool.query("SELECT * FROM products WHERE category_id = ?", [categoryId]);
    return rows; // retorna arreglo, vacio si no hay productos en esa categoria
  },

  // inserta un nuevo producto en la base de datos
  create: async (newProduct) => {
    const { name, price, stock, category_id } = newProduct; // extrae los campos del objeto recibido
    const [result] = await pool.query(
      "INSERT INTO products (name, price, stock, category_id) VALUES (?, ?, ?, ?)",
      [name, price, stock ?? 5, category_id] // si no viene stock usa 5 por defecto igual que en la tabla
    );
    // retorna el producto recien creado buscandolo por el id que mysql genero automaticamente
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  // actualiza los campos de un producto existente
  update: async (id, updatedFields) => {
    const { name, price, stock, category_id } = updatedFields; // extrae solo los campos que llegaron
    await pool.query(
      "UPDATE products SET name = ?, price = ?, stock = ?, category_id = ? WHERE id = ?",
      [name, price, stock, category_id, id]
    );
    // retorna el producto actualizado para enviarselo al cliente
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0]; // undefined si no existia el id
  },

  // elimina un producto de la base de datos por su id
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
    return result.affectedRows > 0; // retorna true si se elimino algo, false si el id no existia
  },

  // verifica si existe al menos un producto vinculado a una categoria
  // retorna true si hay productos, false si no hay ninguno
  existsByCategoryId: async (categoryId) => {
    const [rows] = await pool.query("SELECT id FROM products WHERE category_id = ? LIMIT 1", [categoryId]);
    return rows.length > 0; // si el arreglo tiene algo es porque existe al menos un producto
  },
};