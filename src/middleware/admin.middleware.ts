import { FastifyReply, FastifyRequest } from "fastify";

export async function adminMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.user) {
    return reply.status(401).send({ message: "Usuário não autenticado" });
  }

  if (request.user.role !== "ADMIN") {
    return reply.status(403).send({ message: "Acesso restrito a administradores" });
  }
}
