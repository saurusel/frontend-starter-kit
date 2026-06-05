import { useState } from 'react'
import { toast } from 'sonner'
import { Bell, Info, Settings, Star, Trash2, User } from 'lucide-react'
import { PageHeader } from '@/shared/ui/page-header'
import { SectionCard } from '@/shared/ui/section-card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Checkbox } from '@/shared/ui/checkbox'
import { Switch } from '@/shared/ui/switch'
import { Label } from '@/shared/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import { MetricCard } from '@/shared/ui/metric-card'
import { StatusBadge } from '@/shared/ui/status-badge'
import { SearchInput } from '@/shared/ui/search-input'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import {
  EmptyState,
} from '@/shared/ui/states/empty-state'
import {
  ErrorState,
} from '@/shared/ui/states/error-state'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'

function ShowSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SectionCard title={title}>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </SectionCard>
  )
}

export default function UiKitPage() {
  const [search, setSearch] = useState('')
  const [checked, setChecked] = useState(false)
  const [toggled, setToggled] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="UI Kit"
        description="Полная витрина компонентов дизайн-системы"
      />

      <Tabs defaultValue="atoms">
        <TabsList>
          <TabsTrigger value="atoms">Атомы</TabsTrigger>
          <TabsTrigger value="molecules">Молекулы</TabsTrigger>
          <TabsTrigger value="feedback">Обратная связь</TabsTrigger>
          <TabsTrigger value="overlays">Оверлеи</TabsTrigger>
        </TabsList>

        {/* ─── АТОМЫ ─── */}
        <TabsContent value="atoms" className="space-y-6 pt-4">
          <ShowSection title="Button — варианты">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </ShowSection>

          <ShowSection title="Button — размеры">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Star className="h-4 w-4" /></Button>
            <Button disabled>Disabled</Button>
          </ShowSection>

          <ShowSection title="Badge">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </ShowSection>

          <ShowSection title="StatusBadge">
            <StatusBadge label="Активен" variant="success" />
            <StatusBadge label="Ожидание" variant="warning" />
            <StatusBadge label="Ошибка" variant="error" />
            <StatusBadge label="Приглашён" variant="info" />
            <StatusBadge label="Неактивен" variant="neutral" />
          </ShowSection>

          <SectionCard title="Avatar">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>ИП</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarFallback className="text-lg">АД</AvatarFallback>
              </Avatar>
            </div>
          </SectionCard>

          <SectionCard title="Skeleton">
            <div className="space-y-3">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-[80px] w-full rounded-md" />
            </div>
          </SectionCard>

          <ShowSection title="Separator">
            <div className="w-full space-y-2">
              <p className="text-sm">Выше</p>
              <Separator />
              <p className="text-sm">Ниже</p>
            </div>
          </ShowSection>
        </TabsContent>

        {/* ─── МОЛЕКУЛЫ ─── */}
        <TabsContent value="molecules" className="space-y-6 pt-4">
          <SectionCard title="Input">
            <div className="max-w-sm space-y-3">
              <Input placeholder="Обычный input" />
              <Input placeholder="С иконкой" className="pl-9" />
              <Input type="password" placeholder="Пароль" />
              <Input disabled placeholder="Disabled" />
            </div>
          </SectionCard>

          <SectionCard title="SearchInput">
            <div className="max-w-sm">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Поиск по имени..."
              />
              {search && (
                <p className="mt-2 text-sm text-muted-foreground">Запрос: «{search}»</p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Textarea">
            <Textarea placeholder="Введите текст..." className="max-w-sm" />
          </SectionCard>

          <SectionCard title="Checkbox & Switch">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="cb1"
                  checked={checked}
                  onCheckedChange={(v) => setChecked(!!v)}
                />
                <Label htmlFor="cb1">
                  {checked ? 'Отмечено' : 'Не отмечено'}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="sw1"
                  checked={toggled}
                  onCheckedChange={setToggled}
                />
                <Label htmlFor="sw1">
                  {toggled ? 'Включено' : 'Выключено'}
                </Label>
              </div>
            </div>
          </SectionCard>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Пользователи" value="1 284" change={12.5} icon={<User className="h-4 w-4" />} />
            <MetricCard title="Проекты" value="57" change={-3.2} icon={<Star className="h-4 w-4" />} />
            <MetricCard title="Заявки" value="340" change={8.1} icon={<Bell className="h-4 w-4" />} />
            <MetricCard title="Выполнено" value="892" change={22.4} icon={<Settings className="h-4 w-4" />} />
          </div>
        </TabsContent>

        {/* ─── ОБРАТНАЯ СВЯЗЬ ─── */}
        <TabsContent value="feedback" className="space-y-6 pt-4">
          <SectionCard title="Toast уведомления">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => toast.success('Операция выполнена!')}>Success</Button>
              <Button variant="destructive" onClick={() => toast.error('Произошла ошибка!')}>Error</Button>
              <Button variant="outline" onClick={() => toast.warning('Внимание!')}>Warning</Button>
              <Button variant="secondary" onClick={() => toast.info('Информация')}>Info</Button>
              <Button variant="outline" onClick={() => toast('Обычное уведомление')}>Default</Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.promise(new Promise((r) => setTimeout(r, 2000)), {
                    loading: 'Загрузка...',
                    success: 'Готово!',
                    error: 'Ошибка',
                  })
                }
              >
                Promise
              </Button>
            </div>
          </SectionCard>

          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard title="EmptyState">
              <EmptyState
                title="Ничего не найдено"
                description="Попробуйте изменить параметры поиска"
                action={<Button size="sm">Сбросить фильтры</Button>}
              />
            </SectionCard>

            <SectionCard title="ErrorState">
              <ErrorState
                title="Ошибка загрузки"
                description="Не удалось получить данные с сервера"
                onRetry={() => toast.info('Повторная загрузка...')}
              />
            </SectionCard>
          </div>

          <SectionCard title="ConfirmDialog">
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить запись
            </Button>
            <ConfirmDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              title="Удалить запись?"
              description="Это действие необратимо. Запись будет удалена навсегда."
              confirmLabel="Удалить"
              variant="destructive"
              onConfirm={() => {
                setConfirmOpen(false)
                toast.success('Запись удалена')
              }}
            />
          </SectionCard>
        </TabsContent>

        {/* ─── ОВЕРЛЕИ ─── */}
        <TabsContent value="overlays" className="space-y-6 pt-4">
          <SectionCard title="Dialog">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Открыть диалог</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Заголовок диалога</DialogTitle>
                  <DialogDescription>
                    Это описание диалогового окна. Здесь можно разместить форму или любой контент.
                  </DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">Содержимое диалога...</p>
              </DialogContent>
            </Dialog>
          </SectionCard>

          <SectionCard title="DropdownMenu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Действия
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Управление</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Профиль
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Настройки
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SectionCard>

          <SectionCard title="Tooltip">
            <TooltipProvider>
              <div className="flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Информация о действии</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Настройки приложения</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
