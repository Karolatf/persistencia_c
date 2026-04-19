// MÓDULO: schemas/auth.schema.js
// CAPA:   Schemas (moldes de validacion Zod)
//
// Define las reglas que debe cumplir el body de registro y login
// antes de que lleguen al controlador.
//
// Dependencias: zod

import { z } from 'zod';

// Schema para el registro de un usuario nuevo
export const registerSchema = z.object({
    name: z
        .string({ required_error: 'El nombre es obligatorio' })
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder los 100 caracteres'),

    email: z
        .string({ required_error: 'El correo electronico es obligatorio' })
        .email('El correo electronico no tiene un formato valido'),

    password: z
        .string({ required_error: 'La contrasena es obligatoria' })
        .min(6, 'La contrasena debe tener al menos 6 caracteres'),

    role: z
        .enum(['user', 'admin'], {
            errorMap: () => ({ message: 'El rol debe ser user o admin' }),
        })
        .optional() // si no llega, el modelo usa "user" por defecto
        .default('user'),
}).strict('No envies campos adicionales al registro');

// Schema para el login
export const loginSchema = z.object({
    email: z
        .string({ required_error: 'El correo electronico es obligatorio' })
        .email('El correo electronico no tiene un formato valido'),

    password: z
        .string({ required_error: 'La contrasena es obligatoria' }),
}).strict('No envies campos adicionales al login');