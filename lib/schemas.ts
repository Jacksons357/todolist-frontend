import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Nome do projeto é obrigatório'),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const todoSchema = z.object({
  title: z.string().min(1, 'Título da tarefa é obrigatório'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  note: z.string().optional(),
  projectId: z.string().optional(),
});

export const subtaskSchema = z.object({
  title: z.string().min(1, 'Título da subtarefa é obrigatório'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type TodoFormData = z.infer<typeof todoSchema>;
export type SubtaskFormData = z.infer<typeof subtaskSchema>; 