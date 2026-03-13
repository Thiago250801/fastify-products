import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";

export class AuthService {

  async register(email: string, password: string) {

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed
      }
    });

    return user;
  }

  async login(email: string, password: string) {

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Senha inválida");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    return {
      accessToken,
      refreshToken
    };
  }

}