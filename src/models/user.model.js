// MÓDULO: models/user.model.js
// CAPA:   Models (acceso directo a MySQL para la tabla users)
//
// ACTUALIZACION RBAC: se agrega findByIdWithRoles
// Este metodo es el que usa el middleware de autorizacion para
// obtener los roles y permisos del usuario desde la DB en tiempo real.
// NO guarda roles en el token (el token se mantiene ligero).
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
        return rows[0];
    },

    // Busca un usuario por su id numerico
    // Se usa para verificar existencia sin exponer el hash
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Busca un usuario con todos sus roles y permisos expandidos
    // Se usa en el middleware de autorizacion para verificar acceso
    // La consulta hace JOIN entre users → user_roles → roles → role_permissions → permissions
    // Retorna null si el usuario no existe
    // Retorna el usuario con: id, email, roles (arreglo de nombres) y permissions (arreglo de nombres)
    findByIdWithRoles: async (id) => {
        // Primero verificamos que el usuario exista
        const [users] = await pool.query(
            'SELECT id, name, email FROM users WHERE id = ?',
            [Number(id)]
        );

        if (users.length === 0) return null;

        // Traemos todos los permisos del usuario usando JOIN por las tablas pivote
        // GROUP_CONCAT agrupa los resultados en una sola fila por usuario
        const [rolesRows] = await pool.query(
            `SELECT
                r.name           AS roleName,
                p.name           AS permissionName
             FROM user_roles ur
             JOIN roles r            ON ur.role_id       = r.id
             JOIN role_permissions rp ON rp.role_id      = r.id
             JOIN permissions p       ON rp.permission_id = p.id
             WHERE ur.user_id = ?`,
            [Number(id)]
        );

        // Construimos el objeto de respuesta con sets para evitar duplicados
        const rolesSet       = new Set();
        const permissionsSet = new Set();

        rolesRows.forEach(row => {
            rolesSet.add(row.roleName);
            permissionsSet.add(row.permissionName);
        });

        return {
            ...users[0],
            // roles: arreglo de nombres de roles que tiene el usuario
            roles:       [...rolesSet],
            // permissions: arreglo de permisos unicos de todos sus roles combinados
            permissions: [...permissionsSet],
        };
    },

    // Inserta un usuario nuevo con la contrasena ya encriptada
    // El controlador es responsable de hashear antes de llamar este metodo
    // Retorna el usuario creado sin el campo password_hash
    create: async ({ name, email, passwordHash, role = 'user' }) => {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, passwordHash, role]
        );

        const [createdUser] = await pool.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [result.insertId]
        );
        return createdUser[0];
    },

    // Asigna el rol 'user' por defecto al nuevo usuario en la tabla user_roles
    // Se llama automaticamente despues de create() para que tenga acceso basico
    assignDefaultRole: async (userId) => {
        const [roles] = await pool.query(
            'SELECT id FROM roles WHERE name = ?',
            ['user']
        );

        if (roles.length === 0) return;

        await pool.query(
            'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
            [userId, roles[0].id]
        );
    },
};