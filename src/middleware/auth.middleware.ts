import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticatedUser } from "../types/auth";
import { verifyToken } from "../lib/jwt";
import { AUTH_COOKIE_NAME } from "../config/cookies";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const header = request.headers.authorization;
  const cookieToken = request.cookies?.[AUTH_COOKIE_NAME];

  let token: string | undefined;

  if (header?.startsWith("Bearer ")) {
    token = header.replace("Bearer ", "");
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (!token) {
    return reply.status(401).send({ message: "Authorization header or cookie missing or malformed" });
  }

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
