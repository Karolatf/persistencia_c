import { CategoryModel } from "../models/category.model.js";
// importamos ProductModel para poder consultar productos desde el controlador de categorias
import { ProductModel } from "../models/product.model.js";

// retorna la lista completa de categorias al cliente
const getAllCategories = (req, res) => {
  const categories = CategoryModel.findAll(); // pide todos los datos al modelo
  res.status(200).json({
    success: true,
    message: "Lista de categorías",
    data: categories, // envia el arreglo de categorias
    errors: [],
  });
};

// busca y retorna una sola categoria segun el id que llega por la URL
const getCategoryById = (req, res) => {
  try {
    const { id } = req.params; // extrae el id del parametro de la URL ej: /categories/1
    const category = CategoryModel.findById(Number(id)); // convierte el id a numero y lo busca

    // si el modelo retorna undefined significa que no existe esa categoria
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Categoría con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Categoría encontrada correctamente",
      data: category, // envia el objeto de la categoria encontrada
      errors: [],
    });
  } catch (error) {
    // captura cualquier error inesperado del servidor
    res.status(500).json({
      success: false,
      message: "Error al procesar la búsqueda",
      data: [],
      errors: [],
    });
  }
};

// crea una nueva categoria con los datos que llegan en el body de la peticion
const createCategory = (req, res) => {
  const { name } = req.body; // extrae el campo name del cuerpo de la peticion

  // validacion: el name es obligatorio, si no viene se rechaza con 400
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "El nombre de la categoría es obligatorio",
      data: [],
      errors: [],
    });
  }

  const newCategory = CategoryModel.create({ name }); // envia solo el name al modelo para que cree el objeto
  res.status(201).json({
    success: true,
    message: "Categoría creada correctamente",
    data: newCategory, // envia el objeto recien creado con su id generado
    errors: [],
  });
};

// actualiza los datos de una categoria existente segun el id de la URL
const updateCategory = (req, res) => {
  const { id } = req.params; // extrae el id de la URL
  const updatedCategory = CategoryModel.update(Number(id), req.body); // envia id y campos nuevos al modelo

  // si el modelo retorna null significa que no encontro la categoria con ese id
  if (!updatedCategory) {
    return res.status(404).json({
      success: false,
      message: `Categoría con ID ${id} no encontrada`,
      data: [],
      errors: [],
    });
  }

  res.status(200).json({
    success: true,
    message: "Categoría actualizada correctamente",
    data: updatedCategory, // envia el objeto con los datos ya actualizados
    errors: [],
  });
};

// elimina una categoria pero primero valida que no tenga productos vinculados
const deleteCategory = (req, res) => {
  try {
    const { id } = req.params; // extrae el id de la URL

    // paso 1: verifica que la categoria exista antes de intentar cualquier cosa
    const categoryExists = CategoryModel.findById(Number(id));
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Categoría con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    // paso 2: regla de negocio - pregunta al modelo de productos si hay alguno con ese category_id
    // existsByCategoryId retorna true si hay productos, false si no hay ninguno
    const hasProducts = ProductModel.existsByCategoryId(Number(id));
    if (hasProducts) {
      // 409 Conflict: la operacion es valida pero viola una regla de negocio
      return res.status(409).json({
        success: false,
        message: "No se puede eliminar la categoría porque tiene recursos vinculados",
        data: [],
        errors: [],
      });
    }

    // paso 3: si paso las dos validaciones anteriores, procede a eliminar
    const isDeleted = CategoryModel.delete(Number(id));
    res.status(200).json({
      success: true,
      message: "Categoría eliminada correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    // captura errores inesperados del servidor
    res.status(500).json({
      success: false,
      message: "Error al intentar eliminar la categoría",
      data: [],
      errors: [],
    });
  }
};

// ruta relacional: retorna todos los productos que pertenecen a una categoria especifica
const getProductsByCategory = (req, res) => {
  try {
    const { id } = req.params; // extrae el id de la categoria de la URL

    // paso 1: valida que la categoria exista antes de buscar sus productos
    const categoryExists = CategoryModel.findById(Number(id));
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: `La categoría con ID ${id} no existe`,
        data: [],
        errors: [],
      });
    }

    // paso 2: busca todos los productos que tengan ese category_id usando existsByCategoryId no aplica aqui
    // se usa findByCategoryId en el modelo porque necesitamos el arreglo completo, no solo true/false
    const products = ProductModel.findByCategoryId(Number(id));
    res.status(200).json({
      success: true,
      message: `Productos de la categoría: ${categoryExists.name}`, // incluye el nombre de la categoria en el mensaje
      data: products, // envia el arreglo de productos de esa categoria
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar los productos de la categoría",
      data: [],
      errors: [],
    });
  }
};

// exporta todas las funciones para que las rutas puedan usarlas
export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory, // funcion nueva para la ruta relacional
};