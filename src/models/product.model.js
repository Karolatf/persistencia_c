import productsData from "../data/products.data.js";

export const ProductModel = {

  // Retorna todos los productos
  findAll: () => {
    return productsData;
  },

  // Busca un producto por id numérico
  findById: (id) => {
    return productsData.find((p) => p.id === id);
  },

  // Crea un producto nuevo; ahora también acepta category_id
  create: (newProduct) => {
    const id = productsData.length + 1;
    const productWithId = { id, ...newProduct }; // incluye category_id si viene en newProduct
    productsData.push(productWithId);
    return productWithId;
  },

  // Actualiza los campos de un producto existente
  update: (id, updatedFields) => {
    const index = productsData.findIndex((p) => p.id === id);
    if (index === -1) return null;
    productsData[index] = { ...productsData[index], ...updatedFields };
    return productsData[index];
  },

  // Elimina un producto por id
  delete: (id) => {
    const index = productsData.findIndex((product) => product.id === id);
    if (index === -1) return false;
    productsData.splice(index, 1);
    return true;
  },

  // FASE 4: verifica si existe al menos un producto vinculado a un category_id
  // retorna true si hay productos con ese category_id, false si no hay ninguno
  existsByCategoryId: (categoryId) => {
    return productsData.some((p) => p.category_id === categoryId);
  },
};