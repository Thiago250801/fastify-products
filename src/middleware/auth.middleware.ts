import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticatedUser } from "../types/auth";
import { verifyToken } from "../lib/jwt";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return reply.status(401).send({ message: "Authorization header missing or malformed" });
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = verifyToken(token);

    request.user = {
      id: payload.sub,
      role: payload.role,
    } as AuthenticatedUser;
  } catch (error) {
    return reply.status(401).send({ message: "Token inválido" });
  }
}
