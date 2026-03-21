import { FastifyReply, FastifyRequest } from "fastify";
import { ProductsService } from "../services/products.services";
import { mapProduct } from "../mappers/product.mapper";

const service = new ProductsService();

interface ProductBody {
  name: string;
  price: number;
}

export const createProduct = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (!request.user) {
    return reply.status(401).send({ message: "Usuário não autenticado" });
  }

  const ownerId = request.user.id;
  const payload = request.body as ProductBody;

  const product = await service.create({
    ...payload,
    userId: ownerId,
  });

  return reply.status(201).send({
    data: mapProduct(product),
  });
};

export const getProducts = async (_: FastifyRequest, reply: FastifyReply) => {
  const products = await service.findAll();

  return reply.send({ data: products.map(mapProduct) });
};

export const getProduct = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = request.params as { id: string };

  const product = await service.findById(id);

  return reply.send({
    data: mapProduct(product),
  });
};

export const updateProduct = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (!request.user) {
    return reply.status(401).send({ message: "Usuário não autenticado" });
  }

  const { id } = request.params as { id: string };

  const product = await service.update(
    id,
    request.body as ProductBody,
    request.user.id,
    request.user.role,
  );

  return reply.send({
    data: mapProduct(product),
  });
};

export const deleteProduct = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (!request.user) {
    return reply.status(401).send({ message: "Usuário não autenticado" });
  }

  const { id } = request.params as { id: string };

  await service.delete(id, request.user.id, request.user.role);

  return reply.status(204).send();
};
