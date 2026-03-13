import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/auth.service";

const service = new AuthService();

export const register = async (request: FastifyRequest, reply: FastifyReply) => {

  const { email, password } = request.body as any;

  const user = await service.register(email, password);

  return reply.status(201).send(user);
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {

  const { email, password } = request.body as any;

  const tokens = await service.login(email, password);

  return reply.send(tokens);
};