import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";

// Lista todas las categorías
const getAllCategories = (req, res) => {
  const categories = CategoryModel.findAll();
  res.status(200).json({
    success: true,
    message: "Lista de categorías",
    data: categories,
    errors: [],
  });
};

// Busca una categoría por id
const getCategoryById = (req, res) => {
  try {
    const { id } = req.params;
    const category = CategoryModel.findById(Number(id));

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

// Crea una nueva categoría
const createCategory = (req, res) => {
  const { name } = req.body;

  // el campo name es obligatorio para una categoría
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "El nombre de la categoría es obligatorio",
      data: [],
      errors: [],
    });
  }

  const newCategory = CategoryModel.create({ name });
  res.status(201).json({
    success: true,
    message: "Categoría creada correctamente",
    data: newCategory,
    errors: [],
  });
};

// Actualiza una categoría existente
const updateCategory = (req, res) => {
  const { id } = req.params;
  const updatedCategory = CategoryModel.update(Number(id), req.body);

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
    data: updatedCategory,
    errors: [],
  });
};

// Elimina una categoría solo si no tiene productos vinculados
const deleteCategory = (req, res) => {
  try {
    const { id } = req.params;

    // FASE 4: pregunta al modelo de productos si existe alguno con este category_id
    const hasProducts = ProductModel.existsByCategoryId(Number(id));

    if (hasProducts) {
      // 409 Conflict: no se puede borrar porque hay productos que dependen de esta categoría
      return res.status(409).json({
        success: false,
        message: "No se puede eliminar la categoría porque tiene recursos vinculados",
        data: [],
        errors: [],
      });
    }

    const isDeleted = CategoryModel.delete(Number(id));

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Categoría con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

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

export { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };