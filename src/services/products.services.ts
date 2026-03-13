import { prisma } from "../lib/prisma";
import { ForbiddenError, NotFoundError } from "../errors/http-errors";
import { UserRole } from "../types/auth";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

const includeUser = {
  include: {
    user: {
      select: userSelect,
    },
  },
} as const;

export interface CreateProductInput {
  name: string;
  price: number;
  userId: string;
}

export interface ProductUpdatePayload {
  name?: string;
  price?: number;
}

export class ProductsService {
  async create(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
      ...includeUser,
    } as any);
  }

  async findAll() {
    return prisma.product.findMany({
      ...includeUser,
    } as any);
  }

  async findById(id: string) {
    const product = (await prisma.product.findUnique({
      where: { id },
      ...includeUser,
    } as any)) as any;

    if (!product) {
      throw new NotFoundError("Produto não encontrado");
    }

    return product;
  }

  async update(id: string, data: ProductUpdatePayload, userId: string, role: UserRole) {
    const product = (await prisma.product.findUnique({
      where: { id },
    } as any)) as any;

    if (!product) {
      throw new NotFoundError("Produto não encontrado");
    }

    if (product.userId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenError("Somente o dono ou um administrador pode alterar este produto");
    }

    return prisma.product.update({
      where: { id },
      data,
      ...includeUser,
    } as any);
  }

  async delete(id: string, userId: string, role: UserRole) {
    const product = (await prisma.product.findUnique({
      where: { id },
    } as any)) as any;

    if (!product) {
      throw new NotFoundError("Produto não encontrado");
    }

    if (product.userId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenError("Somente o dono ou um administrador pode deletar este produto");
    }

    await prisma.product.delete({
      where: { id },
    } as any);
  }
}
