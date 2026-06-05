import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/shared/ui/button'
import { EmptyState } from './empty-state'

const meta: Meta<typeof EmptyState> = {
  title: 'UI/States/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: { title: 'Ничего не найдено' },
}

export const WithDescription: Story = {
  args: {
    title: 'Список пуст',
    description: 'Нет данных для отображения. Попробуйте изменить фильтры.',
  },
}

export const WithAction: Story = {
  args: {
    title: 'Пользователи не найдены',
    description: 'Добавьте первого пользователя, чтобы начать работу.',
    action: <Button>Добавить пользователя</Button>,
  },
}
