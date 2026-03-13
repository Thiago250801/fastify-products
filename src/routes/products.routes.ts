import { FastifyInstance } from "fastify";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";

import {
  productBodySchema,
  productParamsSchema,
} from "../schemas/products.schema";

export async function productsRoutes(app: FastifyInstance) {
  app.post(
    "/products",
    {
      schema: {
        body: productBodySchema,
      },
    },
    createProduct,
  );

  app.get("/products", getProducts);

  app.get(
    "/products/:id",
    {
      schema: {
        params: productParamsSchema,
      },
    },
    getProduct,
  );

  app.put(
    "/products/:id",
    {
      schema: {
        params: productParamsSchema,
        body: productBodySchema,
      },
    },
    updateProduct,
  );

  app.delete(
    "/products/:id",
    {
      schema: {
        params: productParamsSchema,
      },
    },
    deleteProduct,
  );
}
