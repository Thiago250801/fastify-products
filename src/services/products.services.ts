import { Prisma } from '../generated/prisma/browser.js';
import { prisma } from '../lib/prisma.js';


export class ProductsService {

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data
    });
  }

  async findAll() {
    return prisma.product.findMany();
  }

async findById(id: string) {
  return prisma.product.findUnique({
    where: { id }
  });
}

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id }
    });
  } 

}