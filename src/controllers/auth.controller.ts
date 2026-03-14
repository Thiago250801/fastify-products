import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService, RegisterInput } from "../services/auth.service";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../config/cookies";

const service = new AuthService();

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
  const payload = request.body as RegisterInput;

  const result = await service.register(payload);

  reply.setCookie(AUTH_COOKIE_NAME, result.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  reply.setCookie(REFRESH_COOKIE_NAME, result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  return reply.status(201).send(result);
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as { email: string; password: string };

  const result = await service.login(email, password);

  reply.setCookie(AUTH_COOKIE_NAME, result.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  reply.setCookie(REFRESH_COOKIE_NAME, result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  return reply.send(result);
};

export const me = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user) {
    return reply.status(401).send({ message: "Usuário não autenticado" });
  }

  const user = await service.me(request.user.id);

  return reply.send(user);
};
