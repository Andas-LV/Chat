import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(20),
    password: z.string().min(3)
});

export const loginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string()
});