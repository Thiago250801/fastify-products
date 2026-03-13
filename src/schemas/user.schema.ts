import { z } from "zod";

export const userRoleSchema = z.enum(["USER", "ADMIN"]);

export const userParamsSchema = z.object({
  id: z.uuid("ID inválido"),
});

export const userResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: userRoleSchema,
  createdAt: z.iso.datetime(),
});

export const userListResponseSchema = z.array(userResponseSchema);

export const userUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  role: userRoleSchema.optional(),
});
