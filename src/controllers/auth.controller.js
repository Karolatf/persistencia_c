// MÓDULO: controllers/auth.controller.js
// CAPA:   Controllers
//
// Responsabilidad unica: manejar el registro y el login de usuarios.
//
// Flujo de REGISTRO:
//   1. Zod ya valido el body antes de llegar aqui (validateSchema en la ruta)
//   2. Verificamos que el email no este ya registrado
//   3. Hasheamos la contrasena con bcryptjs (saltRounds = 10)
//   4. Guardamos el usuario con el hash (nunca el texto plano)
//   5. Respondemos con el usuario creado (sin el hash)
//
// Flujo de LOGIN (preparado para el punto 3 de la guia):
//   1. Zod ya valido el body
//   2. Buscamos el usuario por email
//   3. Comparamos la contrasena con bcrypt.compare
//   4. Si coincide, generamos el JWT con expiresIn: "1h"
//   5. Respondemos con el token
//
// Dependencias:
//   bcryptjs          — para hashear y comparar contrasenas
//   jsonwebtoken      — para generar y verificar tokens
//   models/user.model.js
//   utils/catchAsync.js
//   utils/response.handler.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse } from '../utils/response.handler.js';

// Numero de rondas de salado para bcrypt
// 10 es el valor estandar de la industria: seguro sin ser demasiado lento
const SALT_ROUNDS = 10;

// Clave secreta para firmar los tokens
// En produccion SIEMPRE debe venir del archivo .env, nunca en el codigo
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_temporal_cambiar_en_produccion';

// ── REGISTRO ─────────────────────────────────────────────────────────────────
// POST /auth/register
// Crea un usuario nuevo encriptando la contrasena antes de guardar en MySQL
export const register = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Paso 1: verificar que el email no este ya registrado
    // Si permitimos duplicados el sistema quedaria con datos inconsistentes
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
        const error = new Error('El correo electronico ya esta registrado');
        error.statusCode = 409; // Conflict: el recurso ya existe
        return next(error);
    }

    // Paso 2: encriptar la contrasena con bcrypt
    // bcrypt.hash genera automaticamente un salt aleatorio con saltRounds = 10
    // El resultado es una cadena irreversible: "no se puede des-hashear"
    // Ejemplo del hash resultante: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Paso 3: guardar el usuario con el hash (NUNCA con el texto plano)
    const newUser = await UserModel.create({ name, email, passwordHash, role });

    // Paso 4: responder con el usuario creado
    // El modelo ya excluye password_hash de la respuesta por seguridad
    return successResponse(res, 201, 'Usuario registrado correctamente', newUser);
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// POST /auth/login
// Verifica credenciales y entrega un JWT con expiracion de 1 hora
export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Paso 1: buscar el usuario — necesitamos el hash para comparar
    const user = await UserModel.findByEmail(email);
    if (!user) {
        // Usamos el mismo mensaje para email y contrasena incorrectos
        // Dar mensajes distintos le diria al atacante si el email existe o no
        const error = new Error('Credenciales incorrectas');
        error.statusCode = 401; // Unauthorized
        return next(error);
    }

    // Paso 2: comparar la contrasena enviada con el hash guardado en MySQL
    // bcrypt.compare hashea la contrasena recibida con el mismo salt del hash
    // y compara — retorna true si coinciden, false si no
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
        const error = new Error('Credenciales incorrectas');
        error.statusCode = 401;
        return next(error);
    }

    // Paso 3: generar el JWT
    // El payload contiene informacion del usuario que viajara dentro del token
    // NUNCA incluir password_hash ni datos sensibles en el payload
    const payload = {
        id:    user.id,
        email: user.email,
        role:  user.role,
    };

    // jwt.sign(payload, clave_secreta, opciones)
    // expiresIn: "1h" significa que el token caduca exactamente en 1 hora
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Paso 4: responder con el token — el cliente lo guardara para usarlo
    return successResponse(res, 200, 'Inicio de sesion exitoso', { token });
});