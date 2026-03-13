import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateUserInput, UsersService } from "../services/users.service";

const service = new UsersService();

export const getUsers = async (_: FastifyRequest, reply: FastifyReply) => {
  const users = await service.findAll();
  return reply.send(users);
};

export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const user = await service.findById(id);
  return reply.send(user);
};

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const payload = request.body as UpdateUserInput;
  const user = await service.update(id, payload);
  return reply.send(user);
};

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  await service.delete(id);
  return reply.status(204).send();
};
