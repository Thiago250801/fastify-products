import { z } from "zod";
import { userResponseSchema } from "./user.schema";

export const productBodySchema = z.object({
name: z
  .string()
  .min(3, "Nome deve ter no mínimo 3 caracteres")
  .describe("Nome do produto").meta({
    example: "Notebook Dell"
  }),

price: z
  .number()
  .positive("Preço deve ser positivo")
  .describe("Preço do produto em reais")
  .meta({
    example : 3500
  })
});

export const productParamsSchema = z.object({
  id: z
    .uuid("ID inválido")
    .describe("ID do produto")
    .meta({
      example: "a3bb189e-8bf9-3888-9912-ace4e6543002"
    })
});

const productBaseSchema = z.object({
  id: z.uuid().describe("ID do produto"),
  name: z.string().describe("Nome do produto"),
  price: z.number().describe("Preço do produto"),
  userId: z.uuid().describe("ID do usuário dono"),
  createdAt: z.iso.datetime().describe("Data de criação"),
  updatedAt: z.iso.datetime().describe("Data de atualização"),
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
