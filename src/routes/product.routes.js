// MÓDULO: routes/product.routes.js
// CAPA:   Routes
//
// ACTUALIZACION RBAC:
//   Cada ruta ahora tiene TRES capas de proteccion:
//     1. verifyToken        — verifica que el JWT sea valido
//     2. checkPermission()  — verifica que el usuario tenga el permiso atomico
//     3. validateSchema()   — (solo POST/PUT) valida el body con Zod
//
// Orden obligatorio: verifyToken SIEMPRE antes de checkPermission
// porque checkPermission lee req.user que adjunta verifyToken
//
// Dependencias:
//   controllers/product.controller.js
//   middlewares/validator.middleware.js
//   middlewares/auth.middleware.js
//   middlewares/authorization.middleware.js
//   schemas/product.schema.js

import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller.js';
import { validateSchema }    from '../middlewares/validator.middleware.js';
import { verifyToken }       from '../middlewares/auth.middleware.js';
import { checkPermission }   from '../middlewares/authorization.middleware.js';
import { productSchema }     from '../schemas/product.schema.js';

const productRouter = Router();

// GET /products — requiere permiso de lectura
productRouter.get('/',
    verifyToken,
    checkPermission('products.read'),
    getAllProducts
);

// GET /products/:id — requiere permiso de lectura
productRouter.get('/:id',
    verifyToken,
    checkPermission('products.read'),
    getProductById
);

// POST /products — requiere permiso de creacion + validacion del body
productRouter.post('/',
    verifyToken,
    checkPermission('products.create'),
    validateSchema(productSchema),
    createProduct
);

// PUT /products/:id — requiere permiso de actualizacion + validacion del body
productRouter.put('/:id',
    verifyToken,
    checkPermission('products.update'),
    validateSchema(productSchema),
    updateProduct
);

// DELETE /products/:id — requiere permiso de eliminacion (solo admin)
productRouter.delete('/:id',
    verifyToken,
    checkPermission('products.delete'),
    deleteProduct
);

export default productRouter;