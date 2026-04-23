// MÓDULO: routes/category.routes.js
// CAPA:   Routes
//
// ACTUALIZACION RBAC: se agrega checkPermission a todas las rutas
// siguiendo el mismo patron que product.routes.js
//
// Dependencias:
//   controllers/category.controller.js
//   middlewares/validator.middleware.js
//   middlewares/auth.middleware.js
//   middlewares/authorization.middleware.js
//   schemas/category.schema.js

import { Router } from 'express';
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getProductsByCategory,
} from '../controllers/category.controller.js';
import { validateSchema }  from '../middlewares/validator.middleware.js';
import { verifyToken }     from '../middlewares/auth.middleware.js';
import { checkPermission } from '../middlewares/authorization.middleware.js';
import { categorySchema }  from '../schemas/category.schema.js';

const categoryRouter = Router();

// GET /categories — lectura publica para usuarios con rol user o admin
categoryRouter.get('/',
    verifyToken,
    checkPermission('categories.read'),
    getAllCategories
);

// GET /categories/:id — lectura
categoryRouter.get('/:id',
    verifyToken,
    checkPermission('categories.read'),
    getCategoryById
);

// POST /categories — solo admin puede crear
categoryRouter.post('/',
    verifyToken,
    checkPermission('categories.create'),
    validateSchema(categorySchema),
    createCategory
);

// PUT /categories/:id — solo admin puede actualizar
categoryRouter.put('/:id',
    verifyToken,
    checkPermission('categories.update'),
    validateSchema(categorySchema),
    updateCategory
);

// DELETE /categories/:id — solo admin puede eliminar
categoryRouter.delete('/:id',
    verifyToken,
    checkPermission('categories.delete'),
    deleteCategory
);

// GET /categories/:id/products — lectura
categoryRouter.get('/:id/products',
    verifyToken,
    checkPermission('categories.read'),
    getProductsByCategory
);

export default categoryRouter;