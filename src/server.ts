import fastify from "fastify";
import "dotenv/config"
import fastifyCookie from "@fastify/cookie";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { Prisma } from "./generated/prisma/client";

import {
  ForbiddenError,
  NotFoundError,
  AuthenticationError,
} from "./errors/http-errors";

import { productsRoutes } from "./routes/products.routes";
import { usersRoutes } from "./routes/users.routes";
import { authRoutes } from "./routes/auth.routes";
import fastifyCors from "@fastify/cors";

const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const server = app.withTypeProvider<ZodTypeProvider>();
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT ?? 3333);
const host = process.env.HOST ?? "0.0.0.0";


server.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

server.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET ?? "cookie-secret",
  parseOptions: {
    secure: isProduction,
    sameSite: "lax",
  },
});

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
      {
        name: "Users",
        description: "Operações administrativas sobre usuários",
      },
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
server.listen({ port, host }).then(() => {
  console.log(`HTTP server running on ${host}:${port}`);
});
