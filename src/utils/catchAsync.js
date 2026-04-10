// MÓDULO: utils/catchAsync.js
// CAPA:   Utils (función reutilizable e independiente)
//
// Responsabilidad ÚNICA: envolver funciones asíncronas para atrapar
// cualquier error y pasarlo automáticamente al middleware global de errores.
//
// Sin catchAsync habría que escribir try/catch en CADA controlador.
// Con catchAsync, un solo punto maneja todos los errores del sistema.
//
// Flujo:
//   controlador async lanza error
//   → .catch(next) lo intercepta
//   → next(error) llega al globalErrorHandler en app.js
//   → globalErrorHandler responde al cliente con formato estándar
//
// Dependencias: NINGUNA

export const catchAsync = (fn) => {
  // Retorna una función nueva que Express puede usar como handler de ruta
  // Express llama esta función pasándole (req, res, next) automáticamente
  return (req, res, next) => {
    // Ejecutamos la función del controlador
    // Si lanza un error asíncrono, .catch(next) lo captura
    // y lo envía directamente al middleware global de errores
    fn(req, res, next).catch(next);
  };
};