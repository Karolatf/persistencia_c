// MÓDULO: controllers/auth.controller.js
// CAPA:   Controllers
//
// ACTUALIZACION RBAC:
//   - register ahora asigna el rol 'user' por defecto en user_roles
//   - login ahora incluye { token, roles } en la respuesta
//     Los roles se extraen de la DB en tiempo real, NO se guardan en el token
//
// Dependencias:
//   bcryptjs
//   jsonwebtoken
//   models/user.model.js
//   utils/catchAsync.js
//   utils/response.handler.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse } from '../utils/response.handler.js';

// Numero de rondas de salado para bcrypt
const SALT_ROUNDS = 10;

// Clave secreta para firmar los tokens — siempre del .env en produccion
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_temporal_cambiar_en_produccion';

// ── REGISTRO ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Crea un usuario nuevo, hashea su contrasena y asigna el rol 'user' por defecto
export const register = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Paso 1: verificar que el email no este ya registrado
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
        const error = new Error('El correo electronico ya esta registrado');
        error.statusCode = 409;
        return next(error);
    }

    // Paso 2: encriptar la contrasena con bcrypt antes de guardarla
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Paso 3: guardar el usuario con el hash en la tabla users
    const newUser = await UserModel.create({ name, email, passwordHash, role });

    // Paso 4: asignar el rol por defecto en la tabla user_roles
    // Esto conecta al nuevo usuario con el rol 'user' de la tabla roles
    await UserModel.assignDefaultRole(newUser.id);

    return successResponse(res, 201, 'Usuario registrado correctamente', newUser);
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Verifica credenciales, genera JWT y devuelve los roles del usuario
export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Paso 1: buscar el usuario — necesitamos el hash para comparar
    const user = await UserModel.findByEmail(email);
    if (!user) {
        // Mismo mensaje para email y contrasena incorrectos (seguridad)
        const error = new Error('Credenciales incorrectas');
        error.statusCode = 401;
        return next(error);
    }

    // Paso 2: comparar la contrasena enviada con el hash guardado
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
        const error = new Error('Credenciales incorrectas');
        error.statusCode = 401;
        return next(error);
    }

    // Paso 3: generar el JWT con payload minimo (sin roles para mantenerlo ligero)
    const payload = {
        id:    user.id,
        email: user.email,
        role:  user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Paso 4: obtener los roles y permisos del usuario desde la DB
    // Los roles NO viajan en el token — el guardia los consulta en tiempo real
    // Esto permite revocar privilegios sin invalidar tokens existentes
    const userWithRoles = await UserModel.findByIdWithRoles(user.id);

    const roles       = userWithRoles ? userWithRoles.roles       : [];
    const permissions = userWithRoles ? userWithRoles.permissions : [];

    // Paso 5: responder con el token Y el resumen de roles/permisos
    // El frontend usa esta informacion para mostrar/ocultar opciones de la UI
    return successResponse(res, 200, 'Inicio de sesion exitoso', {
        token,
        roles,
        permissions,
        user: {
            id:    user.id,
            name:  user.name,
            email: user.email,
        },
    });
});