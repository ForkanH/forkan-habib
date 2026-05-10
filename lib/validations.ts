import { z } from 'zod';
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.enum(['General','Project Inquiry','Collaboration']),
  message: z.string().trim().min(5).max(2000),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
