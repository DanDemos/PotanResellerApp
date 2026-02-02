import { z } from 'zod';

export const loginSchema = z.object({
  phone: z
    .string()
    .min(7, 'Phone number is too short')
    .regex(/^\+?\d+$/, 'Phone must contain only digits and optional leading +'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
