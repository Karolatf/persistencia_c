import { ProductModel } from "../models/product.model.js";

// retorna todos los productos de la base de datos
const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.findAll(); // espera la consulta a mysql
    res.status(200).json({
      success: true,
      message: "Lista de productos",
      data: products,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      data: [],
      errors: [],
    });
  }
};

// busca un producto por su id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(Number(id));

    if (!product) { // undefined si mysql no encontro el id
      return res.status(404).json({
        success: false,
        message: `Producto con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Producto encontrado correctamente",
      data: product,
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

// crea un nuevo producto en la base de datos
const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category_id } = req.body; // extrae los campos del body

    if (!name || !price || !category_id) { // validacion de campos obligatorios
      return res.status(400).json({
        success: false,
        message: "Nombre, precio y category_id son obligatorios",
        data: [],
        errors: [],
      });
    }

    const newProduct = await ProductModel.create({ name, price, stock, category_id });
    res.status(201).json({
      success: true,
      message: "Producto creado correctamente",
      data: newProduct,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el producto",
      data: [],
      errors: [],
    });
  }
};

// actualiza un producto existente
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await ProductModel.update(Number(id), req.body);

    if (!updatedProduct) { // undefined si no existia el id
      return res.status(404).json({
        success: false,
        message: `Producto con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Producto actualizado correctamente",
      data: updatedProduct,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      data: [],
      errors: [],
    });
  }
};

// elimina un producto de la base de datos
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await ProductModel.delete(Number(id));

    if (!isDeleted) { // false si el id no existia en mysql
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Producto con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Producto eliminado correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al intentar eliminar el producto",
      data: [],
      errors: [],
    });
  }
};

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };