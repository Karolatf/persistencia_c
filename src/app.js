import express from "express";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js"; // importa las rutas de categorías

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz de bienvenida
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Saludo de la API",
    data: [],
    errors: [],
  });
});

app.use("/products", productRouter);       // rutas de productos en /products
app.use("/categories", categoryRouter);    // rutas de categorías en /categories

export default app;