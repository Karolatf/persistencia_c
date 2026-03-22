import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";

// retorna la lista completa de categorias al cliente
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll(); // espera la respuesta de mysql
    res.status(200).json({
      success: true,
      message: "Lista de categorías",
      data: categories,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      data: [],
      errors: [],
    });
  }
};

// busca y retorna una sola categoria segun el id de la URL
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(Number(id)); // espera la consulta a mysql

    if (!category) { // si mysql no encontro nada retorna undefined
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
      data: category,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al procesar la búsqueda",
      data: [],
      errors: [],
    });
  }
};

// crea una nueva categoria con los datos del body
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) { // validacion: el name es obligatorio
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es obligatorio",
        data: [],
        errors: [],
      });
    }

    const newCategory = await CategoryModel.create({ name }); // inserta en mysql y retorna el registro
    res.status(201).json({
      success: true,
      message: "Categoría creada correctamente",
      data: newCategory,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la categoría",
      data: [],
      errors: [],
    });
  }
};

// actualiza una categoria existente
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await CategoryModel.update(Number(id), req.body);

    if (!updatedCategory) { // si mysql no encontro el id retorna undefined
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
      data: updatedCategory,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la categoría",
      data: [],
      errors: [],
    });
  }
};

// elimina una categoria validando primero que no tenga productos vinculados
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // paso 1: verifica que la categoria exista antes de intentar cualquier cosa
    const categoryExists = await CategoryModel.findById(Number(id));
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Categoría con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    // paso 2: regla de negocio - verifica si hay productos vinculados a esta categoria
    const hasProducts = await ProductModel.existsByCategoryId(Number(id));
    if (hasProducts) {
      return res.status(409).json({ // 409 Conflict: viola una regla de negocio
        success: false,
        message: "No se puede eliminar la categoría porque tiene recursos vinculados",
        data: [],
        errors: [],
      });
    }

    // paso 3: si paso las validaciones procede a eliminar
    await CategoryModel.delete(Number(id));
    res.status(200).json({
      success: true,
      message: "Categoría eliminada correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al intentar eliminar la categoría",
      data: [],
      errors: [],
    });
  }
};

// retorna todos los productos que pertenecen a una categoria especifica
const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // paso 1: valida que la categoria exista
    const categoryExists = await CategoryModel.findById(Number(id));
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: `La categoría con ID ${id} no existe`,
        data: [],
        errors: [],
      });
    }

    // paso 2: busca todos los productos de esa categoria en mysql
    const products = await ProductModel.findByCategoryId(Number(id));
    res.status(200).json({
      success: true,
      message: `Productos de la categoría: ${categoryExists.name}`,
      data: products,
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

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
};