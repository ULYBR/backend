import { z } from 'zod';

export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username deve ter pelo menos 3 caracteres.' })
    .max(20, { message: 'Username não pode ter mais de 20 caracteres.' }),
  password: z
    .string()
    .min(6, { message: 'Password deve ter pelo menos 6 caracteres.' })
    .max(100, { message: 'Password não pode ter mais de 100 caracteres.' }),
});

export const LoginUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username deve ter pelo menos 3 caracteres.' })
    .max(20, { message: 'Username não pode ter mais de 20 caracteres.' }),
  password: z
    .string()
    .min(6, { message: 'Password deve ter pelo menos 6 caracteres.' })
    .max(100, { message: 'Password não pode ter mais de 100 caracteres.' }),
});
