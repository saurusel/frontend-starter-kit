# Формы

## Стек

- **React Hook Form** — управление состоянием форм
- **zod** — schema-first валидация
- **@hookform/resolvers/zod** — интеграция

## Шаблон формы

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Некорректный email'),
  name: z.string().min(2, 'Минимум 2 символа'),
})
type FormValues = z.infer<typeof schema>

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    setValue,
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    await api.save(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormFieldWrapper label="Email" error={errors.email?.message} required>
        <Input {...register('email')} />
      </FormFieldWrapper>
      <Button type="submit" disabled={isSubmitting}>Сохранить</Button>
    </form>
  )
}
```

## FormSection / FormFieldWrapper / FormActions

```tsx
// Группировка полей
<FormSection title="Основная информация" description="Обязательные поля">
  <FormFieldWrapper label="Имя" htmlFor="name" required error={errors.name?.message}>
    <Input id="name" {...register('name')} />
  </FormFieldWrapper>
</FormSection>

// Кнопки действий
<FormActions>
  <Button type="submit">Сохранить</Button>
  <Button variant="outline" onClick={onCancel}>Отмена</Button>
  {isDirty && <span className="ml-auto text-xs text-muted-foreground">Не сохранено</span>}
</FormActions>
```

## Server errors

```tsx
const [serverError, setServerError] = useState<string | null>(null)

const onSubmit = async (data: FormValues) => {
  try {
    await api.save(data)
  } catch {
    setServerError('Не удалось сохранить. Попробуйте снова.')
  }
}

// В JSX:
{serverError && (
  <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
    {serverError}
  </p>
)}
```

## Select с RHF

```tsx
<Select onValueChange={(v) => setValue('role', v as UserRole)}>
  <SelectTrigger><SelectValue placeholder="Выберите роль" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="admin">Администратор</SelectItem>
  </SelectContent>
</Select>
```
