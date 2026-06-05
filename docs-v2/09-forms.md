# Формы — полное руководство

Стек: **React Hook Form** (управление состоянием) + **zod** (схема валидации) + **FormFieldWrapper** (обёртка с лейблом и ошибкой).

---

## Минимальная форма

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { FormFieldWrapper } from '@/shared/ui/form-section'

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Некорректный email'),
})
type FormValues = z.infer<typeof schema>

function SimpleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    await api.save(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormFieldWrapper label="Имя" required error={errors.name?.message}>
        <Input placeholder="Введите имя" {...register('name')} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Email" required error={errors.email?.message}>
        <Input type="email" placeholder="mail@example.com" {...register('email')} />
      </FormFieldWrapper>

      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? 'Сохранение...' : 'Сохранить'}
      </Button>
    </form>
  )
}
```

---

## FormFieldWrapper / FormSection / FormActions

```tsx
import {
  FormSection,       // группировка нескольких полей с заголовком
  FormFieldWrapper,  // лейбл + input + текст ошибки
  FormActions,       // контейнер для кнопок формы
} from '@/shared/ui/form-section'

<form onSubmit={handleSubmit(onSubmit)}>

  <FormSection title="Основная информация" description="Заполните обязательные поля">
    <FormFieldWrapper label="Имя" htmlFor="name" required error={errors.name?.message}>
      <Input id="name" {...register('name')} />
    </FormFieldWrapper>

    <FormFieldWrapper label="Email" htmlFor="email" required error={errors.email?.message}>
      <Input id="email" type="email" {...register('email')} />
    </FormFieldWrapper>
  </FormSection>

  <FormSection title="Дополнительно">
    <FormFieldWrapper label="Телефон" htmlFor="phone" error={errors.phone?.message}>
      <Input id="phone" type="tel" placeholder="+7 (999) 000-00-00" {...register('phone')} />
    </FormFieldWrapper>
  </FormSection>

  <FormActions>
    <Button type="submit" disabled={isSubmitting}>Создать</Button>
    <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
    {isDirty && (
      <span className="ml-auto text-xs text-muted-foreground">Есть несохранённые изменения</span>
    )}
  </FormActions>

</form>
```

---

## Схемы валидации (zod)

```ts
import { z } from 'zod'

// Строка с ограничениями
z.string().min(2, 'Минимум 2 символа')
z.string().max(100, 'Максимум 100 символов')
z.string().email('Некорректный email')
z.string().url('Некорректный URL')
z.string().regex(/^\d+$/, 'Только цифры')
z.string().nonempty('Поле обязательно')

// Число
z.number().min(0, 'Не может быть отрицательным')
z.number().max(1000, 'Максимум 1000')
z.number().int('Только целые числа')
z.coerce.number()  // принудительное приведение из строки

// Опциональные поля
z.string().optional()                    // может быть undefined
z.string().nullable()                    // может быть null
z.string().optional().or(z.literal('')) // может быть пустой строкой

// Enum
z.enum(['admin', 'manager', 'user', 'guest'])

// Условная валидация
z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: 'Пароли не совпадают', path: ['confirmPassword'] }
)
```

---

## Select с React Hook Form

Select из Radix UI не работает через `register` — нужно использовать `setValue`:

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

const schema = z.object({
  role: z.enum(['admin', 'manager', 'user', 'guest'], {
    required_error: 'Выберите роль',
  }),
})

function RoleForm() {
  const { setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })
  const role = watch('role')

  return (
    <FormFieldWrapper label="Роль" required error={errors.role?.message}>
      <Select value={role} onValueChange={(v) => setValue('role', v as UserRole, { shouldValidate: true })}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите роль" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Администратор</SelectItem>
          <SelectItem value="manager">Менеджер</SelectItem>
          <SelectItem value="user">Пользователь</SelectItem>
          <SelectItem value="guest">Гость</SelectItem>
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  )
}
```

---

## Checkbox / Switch с React Hook Form

```tsx
import { Controller } from 'react-hook-form'
import { Checkbox } from '@/shared/ui/checkbox'
import { Switch } from '@/shared/ui/switch'

// Checkbox через Controller:
<Controller
  name="agree"
  control={control}
  render={({ field }) => (
    <div className="flex items-center gap-2">
      <Checkbox
        id="agree"
        checked={field.value}
        onCheckedChange={field.onChange}
      />
      <Label htmlFor="agree">Согласен с условиями</Label>
    </div>
  )}
/>

// Switch через Controller:
<Controller
  name="notifications"
  control={control}
  render={({ field }) => (
    <Switch checked={field.value} onCheckedChange={field.onChange} />
  )}
/>
```

---

## Textarea

```tsx
import { Textarea } from '@/shared/ui/textarea'

<FormFieldWrapper label="Описание" error={errors.description?.message}>
  <Textarea
    placeholder="Опишите задачу..."
    rows={4}
    {...register('description')}
  />
</FormFieldWrapper>
```

---

## Обработка серверных ошибок

```tsx
function CreateForm() {
  const createRequest = useCreateRequest()
  const { setError, formState: { errors } } = useForm(...)

  const onSubmit = async (data: FormValues) => {
    try {
      await createRequest.mutateAsync(data)
      toast.success('Создано успешно')
      onSuccess?.()
    } catch (err) {
      // Ошибка всего поля (root):
      setError('root', { message: 'Не удалось создать. Попробуйте снова.' })

      // Ошибка конкретного поля (если бэкенд вернул):
      // setError('email', { message: 'Email уже занят' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Общая ошибка сервера */}
      {errors.root && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive mb-4">
          {errors.root.message}
        </div>
      )}

      {/* Поля формы */}
      ...
    </form>
  )
}
```

---

## Форма редактирования (заполнить из существующих данных)

```tsx
const { data: user } = useUser(userId)
const updateUser = useUpdateUser()

const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<EditValues>({
  resolver: zodResolver(editSchema),
  values: user
    ? { name: user.name, email: user.email, role: user.role }
    : undefined,
  // values — в отличие от defaultValues, обновляется когда меняются данные (re-fetch)
})

const onSubmit = async (data: EditValues) => {
  await updateUser.mutateAsync({ id: userId, ...data })
  toast.success('Изменения сохранены')
  reset(data)  // обнуляем isDirty
}
```

---

## Условные поля

```tsx
const { watch, register } = useForm(...)
const type = watch('type')  // подписка на изменения

<Select onValueChange={(v) => setValue('type', v)}>
  ...
</Select>

{/* Показывать только если type = 'company' */}
{type === 'company' && (
  <FormFieldWrapper label="ИНН" error={errors.inn?.message}>
    <Input {...register('inn')} />
  </FormFieldWrapper>
)}
```

---

## Форма в диалоге — полный паттерн

```tsx
// src/features/request/create-request/ui/create-request-form.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Button } from '@/shared/ui/button'
import { FormFieldWrapper, FormActions } from '@/shared/ui/form-section'
import { useCreateRequest } from '@/entities/request/model/request.queries'

const schema = z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(100, 'Максимум 100 символов'),
  description: z.string().min(10, 'Минимум 10 символов'),
  priority: z.enum(['low', 'medium', 'high'], { required_error: 'Выберите приоритет' }),
})
type FormValues = z.infer<typeof schema>

interface Props {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateRequestForm({ onSuccess, onCancel }: Props) {
  const createRequest = useCreateRequest()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const priority = watch('priority')

  const onSubmit = async (data: FormValues) => {
    try {
      await createRequest.mutateAsync(data)
      toast.success('Заявка создана')
      onSuccess?.()
    } catch {
      toast.error('Не удалось создать заявку')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormFieldWrapper label="Название" required error={errors.title?.message}>
        <Input placeholder="Краткое название заявки" {...register('title')} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Описание" required error={errors.description?.message}>
        <Textarea placeholder="Подробное описание..." rows={4} {...register('description')} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Приоритет" required error={errors.priority?.message}>
        <Select value={priority} onValueChange={(v) => setValue('priority', v as 'low' | 'medium' | 'high', { shouldValidate: true })}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите приоритет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Низкий</SelectItem>
            <SelectItem value="medium">Средний</SelectItem>
            <SelectItem value="high">Высокий</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldWrapper>

      <FormActions>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Создание...' : 'Создать заявку'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        )}
      </FormActions>
    </form>
  )
}
```
