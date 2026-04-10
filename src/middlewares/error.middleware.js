// MÓDULO: middlewares/error.middleware.js
// CAPA:   Middlewares
//
// Actualización respecto a la versión anterior:
// Ahora maneja err.errors (arreglo estructurado de Zod) cuando existe,
// además de los errores simples de string de las versiones anteriores.
//
// Dependencias: utils/response.handler.js

import { errorResponse } from "../utils/response.handler.js";

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // El mensaje principal que ve el cliente
  const message = err.message || "Error interno del servidor";

  // Si el error trae su propio arreglo detallado (errores de Zod),
  // lo usamos. Si no, metemos el mensaje principal en un arreglo.
  const detailedErrors = err.errors || [err.message];

  return errorResponse(res, statusCode, message, detailedErrors);
};