import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService, RegisterInput } from "../services/auth.service";

const service = new AuthService();

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
  const payload = request.body as RegisterInput;

  const result = await service.register(payload);

  return reply.status(201).send(result);
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as { email: string; password: string };

  const result = await service.login(email, password);

  return reply.send(result);
};

export const me = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user) {
    return reply.status(401).send({ message: "Usuário não autenticado" });
  }

  const user = await service.me(request.user.id);

  return reply.send(user);
};
