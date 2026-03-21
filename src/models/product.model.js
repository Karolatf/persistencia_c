import productsData from "../data/products.data.js"; // importa el arreglo de productos en memoria

export const ProductModel = {

  // retorna el arreglo completo de productos sin filtros
  findAll: () => {
    return productsData;
  },

  // busca y retorna un solo producto que coincida con el id recibido
  findById: (id) => {
    return productsData.find((p) => p.id === id); // .find retorna el primer objeto que cumpla la condicion
  },

  // busca y retorna TODOS los productos que pertenezcan a una categoria
  // se usa .filter porque una categoria puede tener muchos productos (retorna arreglo)
  findByCategoryId: (categoryId) => {
    return productsData.filter((p) => p.category_id === categoryId);
  },

  // crea un producto nuevo con id automatico y lo agrega al arreglo en memoria
  create: (newProduct) => {
    const id = productsData.length + 1; // genera id sumando 1 al total actual (simula AUTO_INCREMENT)
    const productWithId = { id, ...newProduct }; // combina el id generado con los datos recibidos incluido category_id
    productsData.push(productWithId); // agrega el nuevo objeto al final del arreglo
    return productWithId; // retorna el objeto completo con su id
  },

  // actualiza los campos de un producto existente sin perder los que no se enviaron
  update: (id, updatedFields) => {
    const index = productsData.findIndex((p) => p.id === id); // busca la posicion del producto en el arreglo
    if (index === -1) return null; // si no existe retorna null para que el controlador responda 404
    productsData[index] = { ...productsData[index], ...updatedFields }; // fusiona datos existentes con los nuevos
    return productsData[index]; // retorna el producto ya actualizado
  },

  // elimina un producto del arreglo segun su id
  delete: (id) => {
    const index = productsData.findIndex((product) => product.id === id); // busca la posicion
    if (index === -1) return false; // si no existe retorna false para que el controlador responda 404
    productsData.splice(index, 1); // elimina 1 elemento en esa posicion
    return true; // retorna true para confirmar que se elimino
  },

  // verifica si existe AL MENOS UN producto vinculado a una categoria
  // retorna true si hay productos con ese category_id, false si no hay ninguno
  // se usa en deleteCategory para la regla de integridad antes de borrar una categoria
  existsByCategoryId: (categoryId) => {
    return productsData.some((p) => p.category_id === categoryId); // .some para en el primer true que encuentre
  },
};