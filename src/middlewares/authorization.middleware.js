// MÓDULO: middlewares/authorization.middleware.js
// CAPA:   Middlewares
//
// Responsabilidad unica: verificar que el usuario autenticado tenga
// el permiso especifico requerido por una ruta antes de dejarle pasar.
//
// Este middleware usa el patron CLOSURE (funcion que retorna otra funcion).
// Eso permite pasarle el nombre del permiso requerido directamente en la ruta:
//   router.delete('/:id', verifyToken, checkPermission('products.delete'), deleteProduct)
//
// Flujo completo:
//   1. verifyToken ya se ejecuto antes y adjunto req.user con { id, email, role }
//   2. checkPermission consulta la DB para obtener los permisos reales del usuario
//   3. Usa .some() para verificar si AL MENOS UNO de sus roles tiene el permiso
//   4. Si lo tiene: llama next() y el controlador se ejecuta
//   5. Si no lo tiene: responde con 403 Forbidden
//
// Por que consultar la DB y no leer del token?
//   Si los permisos estuvieran en el token y se le revocan al usuario,
//   el usuario seguiria teniendo acceso hasta que el token expire.
//   Al consultar la DB en tiempo real, el cambio de permisos es inmediato.
//
// Dependencias:
//   models/user.model.js (metodo findByIdWithRoles)
//   (NO necesita catchAsync porque ya hacemos try/catch manual aqui)

import { UserModel } from '../models/user.model.js';

// checkPermission es una funcion de orden superior (recibe un parametro
// y retorna un middleware de Express con la firma estandar req, res, next)
export const checkPermission = (requiredPermission) => {
    // Esta es la funcion que Express ejecuta en cada peticion
    return async (req, res, next) => {
        try {
            // req.user fue adjuntado por verifyToken — si no existe, falta el middleware anterior
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    message: 'Acceso denegado: usuario no autenticado',
                    data: [],
                    errors: ['Debe ejecutar verifyToken antes de checkPermission'],
                });
            }

            // Consultamos los permisos del usuario en tiempo real desde la DB
            const userWithRoles = await UserModel.findByIdWithRoles(req.user.id);

            // Si el usuario no existe en la DB (fue eliminado despues de hacer login)
            if (!userWithRoles) {
                return res.status(401).json({
                    success: false,
                    message: 'Acceso denegado: el usuario ya no existe en el sistema',
                    data: [],
                    errors: [],
                });
            }

            // .some() recorre el arreglo de permisos y retorna true si al menos uno coincide
            // Este es el criterio de los multiples sombreros: basta con que UN rol tenga el permiso
            const hasPermission = userWithRoles.permissions.some(
                (permission) => permission === requiredPermission
            );

            // Si no tiene el permiso: responde con 403 Forbidden (no 401)
            // 401 = no autenticado, 403 = autenticado pero sin privilegios suficientes
            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: `Acceso denegado: se requiere el permiso '${requiredPermission}'`,
                    data: [],
                    errors: [`El usuario no tiene el permiso requerido: ${requiredPermission}`],
                });
            }

            // Adjuntamos los roles y permisos a req para que el controlador los use si los necesita
            req.userPermissions = userWithRoles.permissions;
            req.userRoles       = userWithRoles.roles;

            // Todo correcto: continuar con el controlador
            next();

        } catch (error) {
            // Error inesperado en la consulta a la DB
            return res.status(500).json({
                success: false,
                message: 'Error interno al verificar permisos',
                data: [],
                errors: [error.message],
            });
        }
    };
};