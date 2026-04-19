// MÓDULO: routes/product.routes.js
// CAPA:   Routes
//
// Actualización: todas las rutas ahora están protegidas con verifyToken.
// El cliente debe enviar un JWT válido en el header Authorization
// para poder acceder a cualquier endpoint de productos.
//
// Dependencias:
//   controllers/product.controller.js
//   middlewares/validator.middleware.js
//   middlewares/auth.middleware.js
//   schemas/product.schema.js

import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { productSchema } from '../schemas/product.schema.js';

const productRouter = Router();

// verifyToken se ejecuta primero en TODAS las rutas de productos
// Si el token no es válido, la petición se detiene aquí con 401
productRouter.get('/', verifyToken, getAllProducts);
productRouter.get('/:id', verifyToken, getProductById);
productRouter.post('/', verifyToken, validateSchema(productSchema), createProduct);
productRouter.put('/:id', verifyToken, validateSchema(productSchema), updateProduct);
productRouter.delete('/:id', verifyToken, deleteProduct);

export default productRouter;