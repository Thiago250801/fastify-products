import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";
import { AuthenticationError, NotFoundError } from "../errors/http-errors";
import { UserRole } from "../types/auth";

type UserView = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthPayload {
  user: UserView;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async register(payload: RegisterInput): Promise<AuthPayload> {
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = (await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email.toLowerCase(),
        password: hashedPassword,
        role: payload.role ?? UserRole.USER,
      },
    } as any)) as any;

    const createdRole = (user.role as UserRole) ?? UserRole.USER;
    const tokens = this.buildTokens(user.id, createdRole);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user: this.toView(user as any),
      ...tokens,
    };
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = (await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    } as any)) as any;

    if (!user) {
      throw new AuthenticationError("Credenciais invÃ¡lidas");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new AuthenticationError("Credenciais invÃ¡lidas");
    }

    const tokens = this.buildTokens(user.id, (user.role as UserRole) ?? UserRole.USER);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user: this.toView(user as any),
      ...tokens,
    };
  }

  async me(userId: string) {
    const user = (await prisma.user.findUnique({
      where: { id: userId },
    } as any)) as any;

    if (!user) {
      throw new NotFoundError("UsuÃ¡rio nÃ£o encontrado");
    }

    return this.toView(user as any);
  }

  private buildTokens(userId: string, role: UserRole) {
    return {
      accessToken: generateAccessToken(userId, role),
      refreshToken: generateRefreshToken(userId, role),
    };
  }

  private toView(user: any): UserView {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: (user.role as UserRole) ?? UserRole.USER,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
