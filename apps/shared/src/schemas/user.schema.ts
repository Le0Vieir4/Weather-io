import { z } from "zod"

export const UserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6)
})

export type UserSchemaType = z.infer<typeof UserSchema>