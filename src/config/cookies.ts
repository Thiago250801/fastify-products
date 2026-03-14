import type { CookieSerializeOptions } from "@fastify/cookie";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

export const AUTH_COOKIE_NAME = "auth_token";
export const REFRESH_COOKIE_NAME = "refresh_token";

export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieSerializeOptions = {
  ...baseCookieOptions,
  maxAge: ACCESS_TOKEN_MAX_AGE,
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieSerializeOptions = {
  ...baseCookieOptions,
  maxAge: REFRESH_TOKEN_MAX_AGE,
};
