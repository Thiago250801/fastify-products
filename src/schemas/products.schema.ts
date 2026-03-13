import { z } from "zod";

export const productBodySchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  price: z.number().positive("Preço deve ser positivo")
});

export const productParamsSchema = z.object({
  id: z.uuid("ID inválido")
});