// MÓDULO: routes/auth.routes.js
// CAPA:   Routes
//
// Define los endpoints publicos de autenticacion.
// Estos NO requieren token porque son los que generan el token.
//
// Dependencias:
//   controllers/auth.controller.js
//   middlewares/validator.middleware.js
//   schemas/auth.schema.js

import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const authRouter = Router();

// POST /auth/register — crea un usuario nuevo con contrasena encriptada
authRouter.post('/register', validateSchema(registerSchema), register);

// POST /auth/login — verifica credenciales y entrega el JWT
authRouter.post('/login', validateSchema(loginSchema), login);

export default authRouter;