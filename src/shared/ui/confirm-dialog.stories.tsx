import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { ConfirmDialog } from './confirm-dialog'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'UI/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ConfirmDialog>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Открыть диалог
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Подтвердите действие"
          description="Вы уверены, что хотите выполнить это действие?"
          confirmLabel="Подтвердить"
          onConfirm={() => setOpen(false)}
        />
      </>
    )
  },
}

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Удалить
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Удалить запись?"
          description="Это действие нельзя отменить. Запись будет удалена навсегда."
          confirmLabel="Удалить"
          variant="destructive"
          onConfirm={() => setOpen(false)}
        />
      </>
    )
  },
}
