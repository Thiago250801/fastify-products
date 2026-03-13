import { AuthenticatedUser } from "../types/auth";

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}
