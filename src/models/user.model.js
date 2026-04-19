// MÓDULO: models/user.model.js
// CAPA:   Models (acceso directo a MySQL para la tabla users)
//
// Responsabilidad única: operaciones de lectura y escritura sobre users.
// NUNCA maneja contraseñas en texto plano ni genera tokens.
// Esa responsabilidad pertenece al controlador y al servicio de tokens.
//
// Dependencias: config/db.js

import pool from '../config/db.js';

export const UserModel = {

    // Busca un usuario por su email
    // Se usa en el login para verificar si el usuario existe
    // Retorna el registro completo (incluyendo password_hash) o undefined
    findByEmail: async (email) => {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0]; // undefined si no existe
    },

    // Busca un usuario por su id numerico
    // Se usa para verificar existencia sin exponer el hash
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0]; // sin password_hash por seguridad
    },

    // Inserta un usuario nuevo con la contrasena ya encriptada
    // El controlador es responsable de hashear antes de llamar este metodo
    // Retorna el usuario creado sin el campo password_hash
    create: async ({ name, email, passwordHash, role = 'user' }) => {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, passwordHash, role]
        );

        // Retornamos el usuario sin el hash — nunca lo exponemos en respuestas
        const [createdUser] = await pool.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [result.insertId]
        );
        return createdUser[0];
    },
};