import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecret";

export function generateAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: "15m"
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: "7d"
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}