import categoriesData from "../data/categories.data.js";

// Modelo de categorías: único responsable de tocar el arreglo de datos
export const CategoryModel = {

  // Retorna todas las categorías del arreglo
  findAll: () => {
    return categoriesData;
  },

  // Busca una categoría por su id numérico
  findById: (id) => {
    return categoriesData.find((c) => c.id === id);
  },

  // Crea una nueva categoría y la agrega al arreglo
  create: (newCategory) => {
    const id = categoriesData.length + 1;          // genera id automático
    const categoryWithId = { id, ...newCategory }; // combina id + datos recibidos
    categoriesData.push(categoryWithId);            // agrega al arreglo
    return categoryWithId;
  },

  // Modifica los campos de una categoría existente
  update: (id, updatedFields) => {
    const index = categoriesData.findIndex((c) => c.id === id);
    if (index === -1) return null;                              // no existe → null
    categoriesData[index] = { ...categoriesData[index], ...updatedFields }; // fusiona
    return categoriesData[index];
  },

  // Elimina una categoría del arreglo por su id
  delete: (id) => {
    const index = categoriesData.findIndex((c) => c.id === id);
    if (index === -1) return false;       // no encontrado → false
    categoriesData.splice(index, 1);      // remueve 1 elemento en esa posición
    return true;
  },
};