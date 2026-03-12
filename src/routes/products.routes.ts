import { FastifyInstance } from "fastify";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/products.controller";

export async function productsRoutes(fastify: FastifyInstance) {
    // @Post - create a new product route
    fastify.post("/products", createProduct);

    // @Get - get all products route
    fastify.get("/products", getProducts);

    // @Get - get a product by id route
    fastify.get("/products/:id", getProduct);

    // @Put - update a product by id route
    fastify.put("/products/:id", updateProduct);

    // @Delete - delete a product by id route
    fastify.delete("/products/:id", deleteProduct);
}