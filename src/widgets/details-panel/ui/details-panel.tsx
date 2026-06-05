import { useState } from 'react'
import { X, Pin, PinOff, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { cn } from '@/shared/lib/cn'
import { LoadingState } from '@/shared/ui/states/loading-state'
import { ErrorState } from '@/shared/ui/states/error-state'
import { EmptyState } from '@/shared/ui/states/empty-state'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

export interface DetailsPanelProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  isPinned?: boolean
  onPinToggle?: () => void
  isLoading?: boolean
  error?: string | null
  isEmpty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  isDirty?: boolean
  onNext?: () => void
  onPrev?: () => void
  hasPrev?: boolean
  hasNext?: boolean
}

const SIZE_CLASSES = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-[480px]',
}

export function DetailsPanel({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  isPinned,
  onPinToggle,
  isLoading,
  error,
  isEmpty,
  emptyTitle,
  emptyDescription,
  isDirty,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
}: DetailsPanelProps) {
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false)

  const handleClose = () => {
    if (isDirty) {
      setCloseConfirmOpen(true)
    } else {
      onClose()
    }
  }

  if (!open) return null

  return (
    <>
      <div
        className={cn(
          'flex h-full flex-col border-l bg-background transition-all',
          SIZE_CLASSES[size],
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 p-4">
          <div className="min-w-0 flex-1">
            {title && <h3 className="truncate font-semibold">{title}</h3>}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            {(onPrev || onNext) && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!hasPrev}
                  onClick={onPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!hasNext}
                  onClick={onNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            {onPinToggle && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onPinToggle}
                title={isPinned ? 'Открепить' : 'Закрепить'}
              >
                {isPinned ? (
                  <PinOff className="h-4 w-4" />
                ) : (
                  <Pin className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Закрыть</span>
            </Button>
          </div>
        </div>
        <Separator />

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState description={error} />
          ) : isEmpty ? (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {footer && (
          <>
            <Separator />
            <div className="p-4">{footer}</div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={closeConfirmOpen}
        onOpenChange={setCloseConfirmOpen}
        title="Несохранённые изменения"
        description="У вас есть несохранённые изменения. Закрыть без сохранения?"
        confirmLabel="Закрыть без сохранения"
        variant="destructive"
        onConfirm={() => {
          setCloseConfirmOpen(false)
          onClose()
        }}
      />
    </>
  )
}
