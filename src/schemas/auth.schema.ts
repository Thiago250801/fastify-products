import { z } from "zod";
import { userResponseSchema } from "./user.schema";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .describe("Nome completo do usuário que será cadastrado.")
    .meta({
      example: "João Silva",
    }),
  email: z
    .email("E-mail inválido")
    .describe("E-mail que será usado para login e comunicação.")
    .meta({
      example: "joao.silva@email.com",
    }),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .describe("Senha de acesso com pelo menos 6 caracteres.")
    .meta({
      example: "SenhaForte123",
    }),
  confirmPassword: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .describe("Confirmação da senha informada no campo password.")
    .meta({
      example: "SenhaForte123",
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas precisam ser idênticas",
  path: ["confirmPassword"],
}).describe("Payload necessário para criar uma nova conta de usuário.").meta({
  example: {
    name: "João Silva",
    email: "joao.silva@email.com",
    password: "SenhaForte123",
    confirmPassword: "SenhaForte123",
  },
});

export const loginSchema = z.object({
  email: z
    .email("E-mail inválido")
    .describe("E-mail cadastrado do usuário.")
    .meta({
      example: "joao.silva@email.com",
    }),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .describe("Senha usada para autenticação.")
    .meta({
      example: "SenhaForte123",
    }),
}).describe("Credenciais usadas para autenticar um usuário existente.").meta({
  example: {
    email: "joao.silva@email.com",
    password: "SenhaForte123",
  },
});

export const authResponseSchema = z.object({
  user: userResponseSchema.describe("Dados do usuário autenticado."),
  accessToken: z
    .string()
    .describe("Token JWT de acesso enviado no corpo da resposta.")
    .meta({
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.token",
    }),
  refreshToken: z
    .string()
    .describe("Token usado para renovar a sessão do usuário.")
    .meta({
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh.token",
    }),
}).describe("Resposta retornada após cadastro ou login com sucesso.").meta({
  example: {
    user: {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: "João Silva",
      email: "joao.silva@email.com",
      role: "USER",
      createdAt: "2026-03-21T14:30:00.000Z",
    },
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.token",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh.token",
  },
});

export const authMeResponseSchema = userResponseSchema.describe(
  "Dados do usuário autenticado retornados pelo endpoint de perfil.",
);
