import { FastifyRequest, FastifyReply } from "fastify";
import { ProductsService } from "../services/products.services";

const service = new ProductsService();

interface ProductParams {
  id: string;
}

interface ProductBody {
  name: string;
  price: number;
}

export const createProduct = async (
  request: FastifyRequest<{ Body: ProductBody }>,
  reply: FastifyReply
) => {
  const product = await service.create(request.body);

  return reply.status(201).send({
    message: "Produto criado com sucesso",
    data: product
  });
};

export const getProducts = async (
  _: FastifyRequest,
  reply: FastifyReply
) => {
  const products = await service.findAll();

  return reply.send(products);
};

export const getProduct = async (
  request: FastifyRequest<{ Params: {id: string} }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  const product = await service.findById(id);

  return reply.send(product);
};

export const updateProduct = async (
  request: FastifyRequest<{ Params: ProductParams; Body: ProductBody }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  const product = await service.update(id, request.body);

  return reply.send({
    message: "Produto atualizado",
    data: product
  });
};

export const deleteProduct = async (
  request: FastifyRequest<{ Params: {id: string} }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  await service.delete(id);

  return reply.status(204).send();
};