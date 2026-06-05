import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  role: z.enum(['admin', 'manager', 'user'], {
    required_error: 'Выберите роль',
  }),
  team: z.string().min(1, 'Укажите команду'),
  status: z.enum(['active', 'inactive', 'invited']).default('active'),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
