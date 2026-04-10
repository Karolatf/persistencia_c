// MÓDULO: schemas/product.schema.js
// CAPA:   Schemas (moldes de validación Zod por entidad)
//
// Responsabilidad ÚNICA: definir las reglas que debe cumplir
// la información de un producto antes de llegar al controlador.
//
// Nota: se usa category_id (columna correcta de inventario_apropiacion)
// El profesor usó categori_id por error en su tabla.
//
// Dependencias: zod

import { z } from "zod";

export const productSchema = z
  .object({
    // name: obligatorio, texto, mínimo 3 caracteres
    name: z
      .string({
        required_error: "El nombre es obligatorio",
        invalid_type_error: "El nombre debe ser un texto válido",
      })
      .min(3, "El nombre debe tener al menos 3 caracteres"),

    // category_id: obligatorio, número entero positivo
    // coincide con la columna category_id de la tabla products
    category_id: z
      .number({
        required_error: "El ID de la categoría es obligatorio",
        invalid_type_error:
          "El ID de la categoría debe ser un número (no texto ni vacío)",
      })
      .int("El ID de la categoría debe ser un número entero")
      .positive("El ID de la categoría debe ser un número positivo"),

    // price: obligatorio, número no negativo
    price: z
      .number({
        required_error: "El precio es obligatorio",
        invalid_type_error: "El precio debe ser un número válido",
      })
      .nonnegative("El precio no puede ser negativo"),
  })
  // strict() rechaza cualquier campo extra que no esté en el schema
  .strict("No envíes campos adicionales que no pertenecen al producto");