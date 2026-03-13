import jwt from "jsonwebtoken";
import { AuthTokenPayload, UserRole } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET ?? "supersecret";

export function generateAccessToken(userId: string, role: UserRole) {
  return jwt.sign(
    { sub: userId, role },
    JWT_SECRET,
    { expiresIn: "15m" },
  );
}

export function generateRefreshToken(userId: string, role: UserRole) {
  return jwt.sign(
    { sub: userId, role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}
