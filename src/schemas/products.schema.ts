import { z } from "zod";
import { userResponseSchema } from "./user.schema";

export const productBodySchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .describe("Nome comercial do produto.")
    .meta({
      example: "Notebook Dell Inspiron 15",
    }),
  price: z
    .number()
    .positive("Preço deve ser positivo")
    .describe("Preço do produto em reais.")
    .meta({
      example: 3599.9,
    }),
}).describe("Dados necessários para criar ou atualizar um produto.").meta({
  example: {
    name: "Notebook Dell Inspiron 15",
    price: 3599.9,
  },
});

export const productParamsSchema = z.object({
  id: z
    .uuid("ID inválido")
    .describe("Identificador único do produto.")
    .meta({
      example: "a3bb189e-8bf9-3888-9912-ace4e6543002",
    }),
}).describe("Parâmetros de rota usados para localizar um produto.");

const productBaseSchema = z.object({
  id: z
    .uuid()
    .describe("Identificador único do produto.")
    .meta({
      example: "a3bb189e-8bf9-3888-9912-ace4e6543002",
    }),
  name: z
    .string()
    .describe("Nome comercial exibido no catálogo.")
    .meta({
      example: "Notebook Dell Inspiron 15",
    }),
  price: z
    .number()
    .describe("Preço atual do produto em reais.")
    .meta({
      example: 3599.9,
    }),
  userId: z
    .uuid()
    .describe("Identificador do usuário proprietário do produto.")
    .meta({
      example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    }),
  createdAt: z
    .iso.datetime()
    .describe("Data e hora de criação do produto.")
    .meta({
      example: "2026-03-21T14:30:00.000Z",
    }),
  updatedAt: z
    .iso.datetime()
    .describe("Data e hora da última atualização do produto.")
    .meta({
      example: "2026-03-21T15:10:00.000Z",
    }),
});

export const productResponseSchema = productBaseSchema.extend({
  user: userResponseSchema.describe("Dados do proprietário do produto."),
}).describe("Representação completa de um produto retornada pela API.").meta({
  example: {
    id: "a3bb189e-8bf9-3888-9912-ace4e6543002",
    name: "Notebook Dell Inspiron 15",
    price: 3599.9,
    userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    createdAt: "2026-03-21T14:30:00.000Z",
    updatedAt: "2026-03-21T15:10:00.000Z",
    user: {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: "Maria Oliveira",
      email: "maria.oliveira@empresa.com",
      role: "USER",
      createdAt: "2026-03-21T14:00:00.000Z",
    },
  },
});

export const productSingleResponseSchema = z.object({
  data: productResponseSchema.describe("Produto retornado pela operação."),
}).describe("Resposta com um único produto.").meta({
  example: {
    data: {
      id: "a3bb189e-8bf9-3888-9912-ace4e6543002",
      name: "Notebook Dell Inspiron 15",
      price: 3599.9,
      userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      createdAt: "2026-03-21T14:30:00.000Z",
      updatedAt: "2026-03-21T15:10:00.000Z",
      user: {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: "Maria Oliveira",
        email: "maria.oliveira@empresa.com",
        role: "USER",
        createdAt: "2026-03-21T14:00:00.000Z",
      },
    },
  },
});

export const productsListResponseSchema = z.object({
  data: z
    .array(productResponseSchema)
    .describe("Lista de produtos encontrados.")
    .meta({
      example: [
        {
          id: "a3bb189e-8bf9-3888-9912-ace4e6543002",
          name: "Notebook Dell Inspiron 15",
          price: 3599.9,
          userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          createdAt: "2026-03-21T14:30:00.000Z",
          updatedAt: "2026-03-21T15:10:00.000Z",
          user: {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            name: "Maria Oliveira",
            email: "maria.oliveira@empresa.com",
            role: "USER",
            createdAt: "2026-03-21T14:00:00.000Z",
          },
        },
      ],
    }),
}).describe("Resposta com a listagem de produtos.").meta({
  example: {
    data: [
      {
        id: "a3bb189e-8bf9-3888-9912-ace4e6543002",
        name: "Notebook Dell Inspiron 15",
        price: 3599.9,
        userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        createdAt: "2026-03-21T14:30:00.000Z",
        updatedAt: "2026-03-21T15:10:00.000Z",
        user: {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "Maria Oliveira",
          email: "maria.oliveira@empresa.com",
          role: "USER",
          createdAt: "2026-03-21T14:00:00.000Z",
        },
      },
    ],
  },
});
