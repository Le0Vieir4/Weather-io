import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().optional(),
  email: z.email(),
  password: z.string().min(6),
});

export type User = z.infer<typeof UserSchema>;
