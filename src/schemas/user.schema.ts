import { z } from "zod";

export const userRoleSchema = z.enum(["USER", "ADMIN"]).describe(
  "Perfil de acesso do usuário dentro do sistema.",
).meta({
  example: "USER",
});

export const userParamsSchema = z.object({
  id: z
    .uuid("ID inválido")
    .describe("Identificador único do usuário.")
    .meta({
      example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    }),
}).describe("Parâmetros de rota usados para identificar um usuário.");

export const userResponseSchema = z.object({
  id: z
    .uuid()
    .describe("Identificador único do usuário.")
    .meta({
      example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    }),
  name: z
    .string()
    .describe("Nome completo exibido no perfil do usuário.")
    .meta({
      example: "Maria Oliveira",
    }),
  email: z
    .email()
    .describe("Endereço de e-mail usado no login.")
    .meta({
      example: "maria.oliveira@empresa.com",
    }),
  role: userRoleSchema,
  createdAt: z
    .iso.datetime()
    .describe("Data e hora em que o usuário foi cadastrado.")
    .meta({
      example: "2026-03-21T14:30:00.000Z",
    }),
}).describe("Dados públicos do usuário retornados pela API.").meta({
  example: {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "Maria Oliveira",
    email: "maria.oliveira@empresa.com",
    role: "USER",
    createdAt: "2026-03-21T14:30:00.000Z",
  },
});

export const userListResponseSchema = z.array(userResponseSchema).describe(
  "Lista de usuários cadastrados no sistema.",
).meta({
  example: [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: "Maria Oliveira",
      email: "maria.oliveira@empresa.com",
      role: "USER",
      createdAt: "2026-03-21T14:30:00.000Z",
    },
    {
      id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      name: "Carlos Souza",
      email: "carlos.souza@empresa.com",
      role: "ADMIN",
      createdAt: "2026-03-20T09:15:00.000Z",
    },
  ],
});

export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .describe("Novo nome completo do usuário.")
    .meta({
      example: "Maria Fernanda Oliveira",
    })
    .optional(),
  email: z
    .email("E-mail inválido")
    .describe("Novo endereço de e-mail do usuário.")
    .meta({
      example: "maria.fernanda@empresa.com",
    })
    .optional(),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .describe("Nova senha do usuário com pelo menos 6 caracteres.")
    .meta({
      example: "NovaSenha123",
    })
    .optional(),
  role: userRoleSchema
    .describe("Novo perfil de acesso atribuído ao usuário.")
    .meta({
      example: "ADMIN",
    })
    .optional(),
}).describe("Campos aceitos para atualização parcial de um usuário.").meta({
  example: {
    name: "Maria Fernanda Oliveira",
    role: "ADMIN",
  },
});
