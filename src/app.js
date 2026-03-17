import express from "express";
import productRouter from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    messaje: "Saludo de la API",
    data: [],
    errors: [],
  });
})

app.use("/products", productRouter);

export default app;