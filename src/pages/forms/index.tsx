import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/shared/ui/page-header'
import { Button } from '@/shared/ui/button'
import { SectionCard } from '@/shared/ui/section-card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { CreateUserForm } from '@/features/user/create-user/ui/create-user-form'
import { DetailsPanel } from '@/widgets/details-panel/ui/details-panel'

export default function FormsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Формы"
        description="Примеры форм с React Hook Form, zod-валидацией, server error и dirty state"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Форма в диалоге */}
        <SectionCard
          title="Форма в диалоге"
          description="Создание пользователя в модальном окне"
        >
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Открыть диалог</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Новый пользователь</DialogTitle>
              </DialogHeader>
              <CreateUserForm
                onSuccess={() => {
                  setDialogOpen(false)
                  toast.success('Пользователь создан')
                }}
                onCancel={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </SectionCard>

        {/* Форма в боковой панели */}
        <SectionCard
          title="Форма в боковой панели"
          description="Создание пользователя в DetailsPanel"
        >
          <Button onClick={() => setPanelOpen(true)}>Открыть панель с формой</Button>
        </SectionCard>

        {/* Форма на странице */}
        <SectionCard
          title="Форма на странице"
          description="Полноценная форма с секциями"
          className="md:col-span-2"
        >
          <CreateUserForm
            onSuccess={() => toast.success('Пользователь создан')}
          />
        </SectionCard>
      </div>

      <DetailsPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="Новый пользователь"
        description="Создание пользователя в боковой панели"
        size="lg"
      >
        <CreateUserForm
          onSuccess={() => {
            setPanelOpen(false)
            toast.success('Пользователь создан')
          }}
          onCancel={() => setPanelOpen(false)}
        />
      </DetailsPanel>
    </div>
  )
}
