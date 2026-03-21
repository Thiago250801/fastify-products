import { FastifyInstance } from "fastify";
import {
  authResponseSchema,
  authMeResponseSchema,
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema";
import { authMiddleware } from "../middleware/auth.middleware";
import { login, me, register } from "../controllers/auth.controller";
import {
  badRequestResponseSchema,
  unauthorizedResponseSchema,
} from "../schemas/common.schema";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Cadastrar novo usuário",
        description:
          "Cria uma nova conta de usuário e retorna os dados do perfil junto com os tokens de autenticação.",
        body: registerSchema,
        response: {
          201: authResponseSchema,
          400: badRequestResponseSchema,
          401: unauthorizedResponseSchema,
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
        summary: "Autenticar usuário",
        description:
          "Valida as credenciais informadas, cria a sessão e retorna os tokens de acesso e renovação.",
        body: loginSchema,
        response: {
          200: authResponseSchema,
          400: badRequestResponseSchema,
          401: unauthorizedResponseSchema,
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
        summary: "Consultar perfil autenticado",
        description:
          "Retorna os dados do usuário associado ao token JWT enviado no header Authorization ou cookie.",
        // security: [{ BearerAuth: [] }],
        response: {
          200: authMeResponseSchema,
          401: unauthorizedResponseSchema,
        },
      },
    },
    me,
  );
}
