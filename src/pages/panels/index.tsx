import { useState } from 'react'
import { PageHeader } from '@/shared/ui/page-header'
import { Button } from '@/shared/ui/button'
import { SectionCard } from '@/shared/ui/section-card'
import { Badge } from '@/shared/ui/badge'
import { DetailsPanel } from '@/widgets/details-panel/ui/details-panel'
import { usePanelStore } from '@/features/panel/model/panel-store'

const DEMO_ITEMS = [
  { id: '1', title: 'Пользователь №1', description: 'Алексей Смирнов • Администратор' },
  { id: '2', title: 'Пользователь №2', description: 'Мария Петрова • Менеджер' },
  { id: '3', title: 'Пользователь №3', description: 'Иван Козлов • Пользователь' },
]

export default function PanelsPage() {
  const { isOpen, isPinned, selectedId, open, close, togglePin, setSelectedId } = usePanelStore()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [loadingDemo, setLoadingDemo] = useState(false)
  const [errorDemo, setErrorDemo] = useState(false)

  const selectedItem = DEMO_ITEMS.find((i) => i.id === selectedId)
  const currentIndex = DEMO_ITEMS.findIndex((i) => i.id === selectedId)

  const handleNext = () => {
    if (currentIndex < DEMO_ITEMS.length - 1) {
      setSelectedId(DEMO_ITEMS[currentIndex + 1].id)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedId(DEMO_ITEMS[currentIndex - 1].id)
    }
  }

  return (
    <div className="flex h-full gap-6">
      {/* Main content */}
      <div className="min-w-0 flex-1 space-y-6">
        <PageHeader
          title="Правые панели"
          description="Демонстрация DetailsPanel с разными режимами и состояниями"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Простая панель */}
          <SectionCard title="Простая панель" description="Открытие, закрытие, закрепление">
            <div className="space-y-2">
              <Button
                size="sm"
                onClick={() => {
                  setLoadingDemo(false)
                  setErrorDemo(false)
                  setIsEditMode(false)
                  setIsDirty(false)
                  setSelectedId('1')
                  open('1')
                }}
              >
                Открыть панель
              </Button>
            </div>
          </SectionCard>

          {/* Панель просмотра/редактирования */}
          <SectionCard title="Режимы просмотра / редактирования">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditMode(false)
                  setIsDirty(false)
                  setSelectedId('1')
                  open('1')
                }}
              >
                Режим просмотра
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsEditMode(true)
                  setIsDirty(false)
                  setSelectedId('1')
                  open('1')
                }}
              >
                Режим редактирования
              </Button>
            </div>
          </SectionCard>

          {/* Несохранённые изменения */}
          <SectionCard title="Несохранённые изменения">
            <Button
              size="sm"
              onClick={() => {
                setIsEditMode(true)
                setIsDirty(true)
                setSelectedId('1')
                open('1')
              }}
            >
              С предупреждением при закрытии
            </Button>
          </SectionCard>

          {/* Состояния */}
          <SectionCard title="Состояния загрузки / ошибки">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setLoadingDemo(true)
                  setErrorDemo(false)
                  open('1')
                }}
              >
                Загрузка
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setLoadingDemo(false)
                  setErrorDemo(true)
                  open('1')
                }}
              >
                Ошибка
              </Button>
            </div>
          </SectionCard>

          {/* Переключение элементов */}
          <SectionCard
            title="Переключение без закрытия"
            description="Кнопки Назад/Вперёд внутри панели"
            className="sm:col-span-2"
          >
            <div className="flex flex-wrap gap-2">
              {DEMO_ITEMS.map((item) => (
                <Button
                  key={item.id}
                  size="sm"
                  variant={selectedId === item.id && isOpen ? 'default' : 'outline'}
                  onClick={() => {
                    setLoadingDemo(false)
                    setErrorDemo(false)
                    setIsEditMode(false)
                    setIsDirty(false)
                    setSelectedId(item.id)
                    open(item.id)
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Details panel */}
      <DetailsPanel
        open={isOpen}
        onClose={close}
        title={selectedItem?.title ?? 'Детали'}
        description={selectedItem?.description}
        isPinned={isPinned}
        onPinToggle={togglePin}
        isLoading={loadingDemo}
        error={errorDemo ? 'Не удалось загрузить данные' : null}
        isDirty={isDirty}
        onNext={handleNext}
        onPrev={handlePrev}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < DEMO_ITEMS.length - 1}
        footer={
          isEditMode ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setIsDirty(false)
                  setIsEditMode(false)
                }}
              >
                Сохранить
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditMode(false)}>
                Отмена
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => setIsEditMode(true)}>
              Редактировать
            </Button>
          )
        }
      >
        {!loadingDemo && !errorDemo && selectedItem && (
          <div className="space-y-4">
            <div className="space-y-2 rounded-md border p-3">
              <p className="text-xs font-medium text-muted-foreground">ИНФОРМАЦИЯ</p>
              <p className="text-sm font-medium">{selectedItem.title}</p>
              <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
            </div>
            {isEditMode ? (
              <div className="space-y-3">
                <Badge variant="secondary">Режим редактирования</Badge>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Имя</label>
                  <input
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    defaultValue={selectedItem.title}
                    onChange={() => setIsDirty(true)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Шаг {currentStep} из 3
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={currentStep === s ? 'default' : 'outline'}
                      onClick={() => setCurrentStep(s)}
                    >
                      Шаг {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DetailsPanel>
    </div>
  )
}
