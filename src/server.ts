import fastify from "fastify";
import { productsRoutes } from "./routes/products.routes";
import { Prisma } from "./generated/prisma/client";

const app = fastify(
    {logger: true}
);

// tratamento de erro global
app.setErrorHandler((error, request, reply) => {
  // erro do Prisma: registro não encontrado
  if (error instanceof Prisma.PrismaClientKnownRequestError) {

    if (error.code === "P2025") {
      return reply.status(404).send({
        status: "error",
        message: "Registro não encontrado"
      })
    }

  }

  // erro padrão
  return reply.status(500).send({
    status: "error",
    message: "Erro interno do servidor"
  })

})

app.register(productsRoutes);

app.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running on port: " + 3333);
});

