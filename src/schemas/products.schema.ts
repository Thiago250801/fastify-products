import { z } from "zod";
import { userResponseSchema } from "./user.schema";

export const productBodySchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  price: z.number().positive("Preço deve ser positivo"),
});

export const productParamsSchema = z.object({
  id: z.uuid("ID inválido"),
});

const productBaseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  price: z.number(),
  userId: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const productResponseSchema = productBaseSchema.extend({
  user: userResponseSchema,
});

export const productSingleResponseSchema = z.object({
  data: productResponseSchema,
});

export const productsListResponseSchema = z.object({
  data: z.array(productResponseSchema),
});
