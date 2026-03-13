import fastify from "fastify";
import { productsRoutes } from "./routes/products.routes";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";

const app = fastify({
  logger: true
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

export const server = app.withTypeProvider<ZodTypeProvider>();

server.register(productsRoutes);

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running on port: 3333");
});