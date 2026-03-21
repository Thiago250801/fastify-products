import { z } from "zod";

export const apiMessageSchema = z.object({
  message: z
    .string()
    .describe("Mensagem descritiva retornada pela API.")
    .meta({
      example: "Operação realizada com sucesso",
    }),
});

export const badRequestResponseSchema = z.object({
  statusCode: z
    .number()
    .describe("Código HTTP retornado para a falha de validação.")
    .meta({
      example: 400,
    }),
  error: z
    .string()
    .describe("Tipo resumido do erro HTTP.")
    .meta({
      example: "Bad Request",
    }),
  message: z
    .string()
    .describe("Detalhe do erro de validação identificado na requisição.")
    .meta({
      example: "body/name Nome deve ter no mínimo 3 caracteres",
    }),
}).describe("Resposta retornada quando a requisição possui dados inválidos.");

export const unauthorizedResponseSchema = apiMessageSchema.describe(
  "Resposta retornada quando a autenticação não foi enviada ou o token é inválido.",
).meta({
  example: {
    message: "Usuário não autenticado",
  },
});

export const forbiddenResponseSchema = apiMessageSchema.describe(
  "Resposta retornada quando o usuário autenticado não tem permissão para acessar o recurso.",
).meta({
  example: {
    message: "Acesso restrito a administradores",
  },
});

export const notFoundResponseSchema = apiMessageSchema.describe(
  "Resposta retornada quando o recurso solicitado não existe.",
).meta({
  example: {
    message: "Produto não encontrado",
  },
});
