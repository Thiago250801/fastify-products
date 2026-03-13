import { FastifyInstance } from "fastify";
import { register, login } from "../controllers/auth.controller";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

export async function authRoutes(app: FastifyInstance) {

  app.post(
    "/register",
    {
      schema: {
        body: registerSchema
      }
    },
    register
  );

  app.post(
    "/login",
    {
      schema: {
        body: loginSchema
      }
    },
    login
  );

}
