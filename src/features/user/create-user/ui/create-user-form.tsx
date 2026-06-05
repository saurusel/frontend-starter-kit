import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { FormFieldWrapper, FormSection, FormActions } from '@/shared/ui/form-section'
import { createUserSchema, type CreateUserFormValues } from '../model/schema'
import { useCreateUser } from '@/entities/user/model/user.queries'

interface CreateUserFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const createUser = useCreateUser()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { status: 'active' },
  })

  const onSubmit = async (data: CreateUserFormValues) => {
    setServerError(null)
    try {
      await createUser.mutateAsync(data)
      reset()
      onSuccess?.()
    } catch {
      setServerError('Не удалось создать пользователя. Попробуйте ещё раз.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Основная информация">
        <FormFieldWrapper label="Имя" htmlFor="name" error={errors.name?.message} required>
          <Input id="name" placeholder="Иван Петров" {...register('name')} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Email" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" placeholder="ivan@example.com" {...register('email')} />
        </FormFieldWrapper>
      </FormSection>

      <FormSection title="Роль и команда">
        <FormFieldWrapper label="Роль" error={errors.role?.message} required>
          <Select onValueChange={(v) => setValue('role', v as CreateUserFormValues['role'])}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Администратор</SelectItem>
              <SelectItem value="manager">Менеджер</SelectItem>
              <SelectItem value="user">Пользователь</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldWrapper>

        <FormFieldWrapper label="Команда" htmlFor="team" error={errors.team?.message} required>
          <Input id="team" placeholder="Разработка" {...register('team')} />
        </FormFieldWrapper>
      </FormSection>

      {serverError && (
        <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <FormActions>
        <Button type="submit" disabled={createUser.isPending}>
          {createUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Создать
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        )}
        {isDirty && !createUser.isPending && (
          <span className="ml-auto text-xs text-muted-foreground">Есть несохранённые изменения</span>
        )}
      </FormActions>
    </form>
  )
}
