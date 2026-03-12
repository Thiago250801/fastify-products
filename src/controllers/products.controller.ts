import { ProductsService } from "../services/products.services";

const service = new ProductsService();


export const createProduct = async (request: any, reply: any) => {
  const product = await service.create(request.body);

  return reply.status(201).send({
    message: "Produto criado com sucesso",
    data: product
  });
};


export const getProducts = async (_: any, reply: any) => {
  const products = await service.findAll();

  return reply.send(products);
};

export const getProduct = async (request: any, reply: any) => {
  const { id } = request.params;

  const product = await service.findById(id);

  return reply.send(product);
};

export const updateProduct = async (request: any, reply: any) => {
  const { id } = request.params;

  const product = await service.update(id, request.body);

  return reply.send({
    message: "Produto atualizado",
    data: product
  });
};

export const deleteProduct = async (request: any, reply: any) => {
  const { id } = request.params;

  const product = await service.delete(id);

  return reply.status(204).send({
    message: "Produto deletado com sucesso",
    data: product 
  });
};