import * as z from "zod"

// DTO for read
export const UserSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3).optional(),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isActive: z.boolean().optional(),
  createAt: z.date().optional(),
  updateAt: z.date().optional(),
  provider: z.string().optional(), // 'google', 'github', etc.
  picture: z.string().optional(), 
  isOAuth: z.boolean().optional(), // Identify if user is logged in via OAuth
})

export type User = z.infer<typeof UserSchema>

// DTO for login
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
export type Login = z.infer<typeof LoginSchema>

// DTO for create
export const CreateUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type CreateUserDto = z.infer<typeof CreateUserSchema>

// DTO for update (partial)
export const UpdateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  picture: z.string().optional(),
})

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>

// DTO for change password
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Senha atual deve ter no mínimo 8 caracteres"),
  newPassword: z.string().min(8, "Nova senha deve ter no mínimo 8 caracteres"),
})

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>