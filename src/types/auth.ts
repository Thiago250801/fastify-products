export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

export interface AuthTokenPayload {
  sub: string;
  role: UserRole;
  iat: number;
  exp: number;
}
