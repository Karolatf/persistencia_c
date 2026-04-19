// MÓDULO: middlewares/auth.middleware.js
// CAPA:   Middlewares
//
// Responsabilidad única: verificar que el token JWT sea válido
// antes de permitir el acceso a cualquier ruta protegida.
//
// Flujo:
//   cliente envía petición con header Authorization: Bearer <token>
//   → este middleware extrae el token
//   → jwt.verify lo valida contra JWT_SECRET
//   → si es válido: adjunta el payload a req.user y llama next()
//   → si falta, expiró o es inválido: responde con 401 en español
//
// Dependencias:
//   jsonwebtoken
//   (NO necesita catchAsync porque jwt.verify es síncrono)

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_sena_2026';

export const verifyToken = (req, res, next) => {

    // El token viaja en el header Authorization con el formato: "Bearer <token>"
    // req.headers.authorization contiene la cadena completa
    const authHeader = req.headers.authorization;

    // Paso 1: verificar que el header exista y tenga el formato correcto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado: Token requerido',
            data: [],
            errors: ['No se encontró el token en el header Authorization'],
        });
    }

    // Paso 2: extraer solo el token (quitamos la palabra "Bearer " del inicio)
    const token = authHeader.split(' ')[1];

    // Paso 3: verificar el token con jwt.verify
    // Si el token es válido retorna el payload decodificado
    // Si no, lanza una excepción que capturamos en el catch
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Paso 4: adjuntar el payload al objeto req para que los controladores
        // puedan leer quién es el usuario sin volver a decodificar el token
        // req.user estará disponible en cualquier ruta que use este middleware
        req.user = decoded;

        // Paso 5: todo bien, continuar con el controlador
        next();

    } catch (error) {

        // jwt.verify lanza diferentes tipos de error según el problema
        // Los diferenciamos para dar el mensaje correcto en español

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado: El token ha expirado, inicie sesión nuevamente',
                data: [],
                errors: ['El token venció el ' + error.expiredAt],
            });
        }

        // JsonWebTokenError cubre firmas inválidas, tokens malformados, etc.
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado: Token inválido',
            data: [],
            errors: [error.message],
        });
    }
};