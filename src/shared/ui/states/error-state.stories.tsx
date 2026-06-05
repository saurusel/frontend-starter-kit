import type { Meta, StoryObj } from '@storybook/react'
import { ErrorState } from './error-state'

const meta: Meta<typeof ErrorState> = {
  title: 'UI/States/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ErrorState>

export const Default: Story = {
  args: { title: 'Ошибка загрузки' },
}

export const WithRetry: Story = {
  args: {
    title: 'Не удалось загрузить данные',
    description: 'Проверьте соединение и попробуйте снова.',
    onRetry: () => alert('Повтор запроса'),
  },
}
