import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Monitor, Moon, Sun } from 'lucide-react'
import { PageHeader } from '@/shared/ui/page-header'
import { SectionCard } from '@/shared/ui/section-card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Switch } from '@/shared/ui/switch'
import { Separator } from '@/shared/ui/separator'
import { FormFieldWrapper } from '@/shared/ui/form-section'
import { useTheme } from '@/app/providers/theme-provider'
import { useSessionStore } from '@/entities/session/model/session-store'

const profileSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  email: z.string().email('Некорректный email'),
})
type ProfileFormValues = z.infer<typeof profileSchema>

const THEME_OPTIONS = [
  { value: 'light', label: 'Светлая', icon: Sun },
  { value: 'dark', label: 'Тёмная', icon: Moon },
  { value: 'system', label: 'Системная', icon: Monitor },
] as const

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const session = useSessionStore((s) => s.session)

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    digest: true,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user.name ?? '',
      email: session?.user.email ?? '',
    },
  })

  const onSaveProfile = async (data: ProfileFormValues) => {
    await new Promise((r) => setTimeout(r, 600))
    reset(data)
    toast.success('Профиль обновлён')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Настройки" description="Управление профилем, темой и уведомлениями" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Профиль */}
          <SectionCard title="Профиль" description="Личная информация аккаунта">
            <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormFieldWrapper label="Имя" htmlFor="name" error={errors.name?.message} required>
                  <Input id="name" {...register('name')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Email" htmlFor="email" error={errors.email?.message} required>
                  <Input id="email" type="email" {...register('email')} />
                </FormFieldWrapper>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={!isDirty || isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Сохранить изменения
                </Button>
                {isDirty && (
                  <span className="text-xs text-muted-foreground">Есть несохранённые изменения</span>
                )}
              </div>
            </form>
          </SectionCard>

          {/* Уведомления */}
          <SectionCard title="Уведомления" description="Управление способами получения уведомлений">
            <div className="space-y-4">
              {[
                { key: 'email' as const, label: 'Email-уведомления', hint: 'Получать уведомления на email' },
                { key: 'push' as const, label: 'Push-уведомления', hint: 'Уведомления в браузере' },
                { key: 'digest' as const, label: 'Еженедельный дайджест', hint: 'Сводка событий за неделю' },
              ].map(({ key, label, hint }) => (
                <div key={key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{hint}</p>
                    </div>
                    <Switch
                      checked={notifications[key]}
                      onCheckedChange={(v) => {
                        setNotifications((prev) => ({ ...prev, [key]: v }))
                        toast.success(`${label} ${v ? 'включены' : 'отключены'}`)
                      }}
                    />
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Тема */}
        <div className="space-y-6">
          <SectionCard title="Внешний вид" description="Выберите тему оформления">
            <div className="space-y-2">
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setTheme(value)
                    toast.success(`Тема: ${label}`)
                  }}
                  className={[
                    'flex w-full items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors',
                    theme === value
                      ? 'border-primary bg-primary/5 font-medium text-primary'
                      : 'border-transparent hover:bg-muted',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                  {theme === value && (
                    <span className="ml-auto text-xs text-primary">Активна</span>
                  )}
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Информация о сессии */}
          {session && (
            <SectionCard title="Сессия">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Пользователь</dt>
                  <dd className="font-medium">{session.user.name}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Роль</dt>
                  <dd className="font-medium capitalize">{session.user.role}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Разрешений</dt>
                  <dd className="font-medium">{session.permissions.length}</dd>
                </div>
              </dl>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  )
}
