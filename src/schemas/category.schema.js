// MÓDULO: schemas/category.schema.js
// CAPA:   Schemas (moldes de validación Zod por entidad)
//
// Responsabilidad ÚNICA: definir las reglas exactas que debe cumplir
// la información de una categoría antes de llegar al controlador.
//
// Si el body del cliente no encaja en este molde, validateSchema
// lo rechaza con 400 antes de que el controlador se ejecute.
//
// Dependencias: zod

import { z } from "zod";

export const categorySchema = z.object({
  // name es obligatorio, debe ser texto, mínimo 3 y máximo 50 caracteres
  name: z
    .string({
      required_error: "El nombre de la categoría es obligatorio",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres"),
});