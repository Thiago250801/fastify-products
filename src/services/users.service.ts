import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../errors/http-errors";
import { UserRole } from "../types/auth";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export class UsersService {
  async findAll() {
    return prisma.user.findMany({
      select: userSelect,
    } as any);
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    } as any);

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    return user;
  }

  async update(id: string, payload: UpdateUserInput) {
    const existing = await prisma.user.findUnique({
      where: { id },
    } as any);

    if (!existing) {
      throw new NotFoundError("Usuário não encontrado");
    }

    const data: UpdateUserInput = { ...payload };

    if (payload.email) {
      data.email = payload.email.toLowerCase();
    }

    if (payload.password) {
      data.password = await bcrypt.hash(payload.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    } as any);
  }

  async delete(id: string) {
    const existing = await prisma.user.findUnique({
      where: { id },
    } as any);

    if (!existing) {
      throw new NotFoundError("Usuário não encontrado");
    }

    await prisma.user.delete({
      where: { id },
    } as any);
  }
}
