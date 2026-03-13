import { FastifyInstance } from "fastify";
import { adminMiddleware } from "../middleware/admin.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  userListResponseSchema,
  userParamsSchema,
  userResponseSchema,
  userUpdateSchema,
} from "../schemas/user.schema";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/users.controller";

const adminStack = [authMiddleware, adminMiddleware];

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    "/users",
    {
      preHandler: adminStack,
      schema: {
        tags: ["Users"],
        summary: "Lista todos os usuários",
        response: {
          200: userListResponseSchema,
        },
      },
    },
    getUsers,
  );

  app.get(
    "/users/:id",
    {
      preHandler: adminStack,
      schema: {
        tags: ["Users"],
        summary: "Busca um usuário pelo ID",
        params: userParamsSchema,
        response: {
          200: userResponseSchema,
        },
      },
    },
    getUser,
  );

  app.patch(
    "/users/:id",
    {
      preHandler: adminStack,
      schema: {
        tags: ["Users"],
        summary: "Atualiza campos de um usuário",
        params: userParamsSchema,
        body: userUpdateSchema,
        response: {
          200: userResponseSchema,
        },
      },
    },
    updateUser,
  );

  app.delete(
    "/users/:id",
    {
      preHandler: adminStack,
      schema: {
        tags: ["Users"],
        summary: "Remove um usuário",
        params: userParamsSchema,
      },
    },
    deleteUser,
  );
}
