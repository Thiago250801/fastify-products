import { FastifyInstance } from "fastify";
import { authResponseSchema, authMeResponseSchema, loginSchema, registerSchema } from "../schemas/auth.schema";
import { authMiddleware } from "../middleware/auth.middleware";
import { login, me, register } from "../controllers/auth.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Registra um novo usuário",
        body: registerSchema,
        response: {
          201: authResponseSchema,
        },
      },
    },
    register,
  );

  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Autentica um usuário existente",
        body: loginSchema,
        response: {
          200: authResponseSchema,
        },
      },
    },
    login,
  );

  app.get(
    "/auth/me",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Auth"],
        summary: "Retorna as informações do usuário autenticado",
        response: {
          200: authMeResponseSchema,
        },
      },
    },
    me,
  );
}
