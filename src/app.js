// MÓDULO: app.js
// Punto central de configuración de Express.
//
// Orden obligatorio:
//   1. Middlewares generales (json, urlencoded)
//   2. Rutas de la aplicación
//   3. Middleware global de errores (SIEMPRE al final)
//
// El globalErrorHandler debe ir DESPUÉS de las rutas porque Express
// solo lo activa cuando alguna ruta llama next(error).

import express from "express";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import authRouter from './routes/auth.routes.js';
// Importar db.js aquí ejecuta la prueba de conexión al arrancar el servidor
import "./config/db.js";
// Importamos el manejador global de errores de la capa de middlewares
import { globalErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.set('strict routing', false);

// Middleware para parsear el body de las peticiones en formato JSON
app.use(express.json());
// Middleware para parsear datos de formularios HTML
app.use(express.urlencoded({ extended: true }));

// Ruta raíz de bienvenida — confirma que el servidor responde
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API de Gestión de Inventario - SENA",
    data: [],
    errors: [],
  });
});

// Registro de rutas bajo sus prefijos correspondientes
app.use('/api/auth', authRouter);     // endpoints publicos de autenticacion
app.use("/products", productRouter);
app.use("/categories", categoryRouter);

// Middleware global de errores — SIEMPRE al final
// Recibe cualquier error que haya pasado por next(error) en las rutas
app.use(globalErrorHandler);

export default app;

