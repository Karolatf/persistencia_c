// MÓDULO: utils/response.handler.js
// CAPA:   Utils
//
// Actualización: errorResponse ahora garantiza que errors
// siempre sea un arreglo, tanto si llega string como arreglo de objetos Zod.
//
// Dependencias: NINGUNA

// Estandariza todas las respuestas exitosas
export const successResponse = (res, statusCode, message, data = []) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
    errors: [],
  });
};

// Estandariza todas las respuestas de error
export const errorResponse = (res, statusCode, message, errors = []) => {
  // Garantizamos que errors siempre sea arreglo
  // Puede llegar como string (errores simples) o como arreglo de objetos Zod
  const formattedErrors = Array.isArray(errors) ? errors : [errors];

  return res.status(statusCode).json({
    success: false,
    message: message,
    data: [],
    errors: formattedErrors,
  });
};