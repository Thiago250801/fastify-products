import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  productBodySchema,
  productParamsSchema,
  productSingleResponseSchema,
  productsListResponseSchema,
} from "../schemas/products.schema";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products.controller";

export async function productsRoutes(app: FastifyInstance) {
  app.get(
    "/products",
    {
      schema: {
        tags: ["Products"],
        summary: "Retorna todos os produtos",
        response: {
          200: productsListResponseSchema,
        },
      },
    },
    getProducts,
  );

  app.get(
    "/products/:id",
    {
      schema: {
        tags: ["Products"],
        summary: "Busca um produto pelo ID",
        params: productParamsSchema,
        response: {
          200: productSingleResponseSchema,
        },
      },
    },
    getProduct,
  );

  app.post(
    "/products",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Products"],
        summary: "Cria um novo produto (usuÃ¡rios autenticados)",
        body: productBodySchema,
        response: {
          201: productSingleResponseSchema,
        },
      },
    },
    createProduct,
  );

  app.put(
    "/products/:id",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Products"],
        summary: "Atualiza um produto (dono ou ADMIN)",
        params: productParamsSchema,
        body: productBodySchema,
        response: {
          200: productSingleResponseSchema,
        },
      },
    },
    updateProduct,
  );

  app.delete(
    "/products/:id",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Products"],
        summary: "Remove um produto (dono ou ADMIN)",
        params: productParamsSchema,
      },
    },
    deleteProduct,
  );
}
