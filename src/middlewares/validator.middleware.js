// MÓDULO: middlewares/validator.middleware.js
// CAPA:   Middlewares
//
// Responsabilidad ÚNICA: ser el middleware genérico que valida el body
// de cualquier petición contra cualquier schema Zod recibido.
//
// Es una función de orden superior: recibe un schema y retorna
// un middleware de Express listo para usar en las rutas.
//
// Uso en rutas:
//   router.post("/", validateSchema(productSchema), createProduct);
//
// Flujo:
//   cliente envía body
//   → schema.safeParse() verifica los datos
//   → si fallan: crea error 400 con lista de campos y llama next(error)
//   → si pasan: reemplaza req.body con datos limpios y llama next()
//   → controlador recibe datos ya validados
//
// Dependencias: NINGUNA (no necesita catchAsync porque safeParse es síncrono)

export const validateSchema = (schema) => {
  return (req, res, next) => {
    // safeParse NO lanza excepción: retorna { success, data } o { success, error }
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Transformamos los issues de Zod en objetos legibles { field, message }
      const structuredErrors = result.error.issues.map((issue) => {
        let finalMessage = issue.message;

        // Zod usa "received undefined" cuando el campo simplemente no llegó
        // Lo reemplazamos por un mensaje más claro en español
        if (finalMessage.includes("received undefined")) {
          finalMessage = "Este campo es obligatorio";
        }

        return {
          // issue.path[0] es el nombre del campo que falló (ej: "name", "price")
          // Si no hay path específico lo marcamos como "body"
          field: issue.path.length > 0 ? issue.path[0] : "body",
          message: finalMessage,
        };
      });

      // Creamos el error operacional con código 400 y la lista estructurada
      const validationError = new Error(
        "Error de validación en los datos enviados",
      );
      validationError.statusCode = 400;
      // Adjuntamos el detalle para que globalErrorHandler lo incluya en la respuesta
      validationError.errors = structuredErrors;

      return next(validationError);
    }

    // Validación exitosa: reemplazamos req.body con los datos limpios de Zod
    req.body = result.data;
    next();
  };
};