import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { Prisma } from "./generated/prisma/client";

import { ForbiddenError, NotFoundError, AuthenticationError } from "./errors/http-errors";

import { productsRoutes } from "./routes/products.routes";
import { usersRoutes } from "./routes/users.routes";
import { authRoutes } from "./routes/auth.routes";

const app = fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const server = app.withTypeProvider<ZodTypeProvider>();

// Swagger
server.register(swagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Produtos API",
      description: "API com autenticação JWT, autorização e CRUD de produtos",
      version: "1.0.0",
    },
    tags: [
      { name: "Auth", description: "Fluxos de autenticação" },
      { name: "Products", description: "CRUD de produtos" },
      { name: "Users", description: "Operações administrativas sobre usuários" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
});

server.register(swaggerUI, {
  routePrefix: "/docs",
});

// error handler
server.setErrorHandler((error, request, reply) => {

  if (error instanceof AuthenticationError) {
    return reply.status(401).send({ message: error.message });
  }

  if (error instanceof ForbiddenError) {
    return reply.status(403).send({ message: error.message });
  }

  const prismaNotFound =
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025";

  if (error instanceof NotFoundError || prismaNotFound) {
    return reply.status(404).send({
      message: error.message || "Recurso não encontrado",
    });
  }

  request.log.error(error);
  return reply.status(500).send({
    message: "Erro interno do servidor",
  });
});

// routes
server.register(authRoutes);
server.register(productsRoutes);
server.register(usersRoutes);

// start
server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running on port: 3333");
});