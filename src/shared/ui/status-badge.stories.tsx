import type { Meta, StoryObj } from '@storybook/react'
import { StatusBadge } from './status-badge'

const meta: Meta<typeof StatusBadge> = {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
    },
  },
}

export default meta
type Story = StoryObj<typeof StatusBadge>

export const Success: Story = { args: { label: 'Активен', variant: 'success' } }
export const Warning: Story = { args: { label: 'Ожидание', variant: 'warning' } }
export const Error: Story = { args: { label: 'Ошибка', variant: 'error' } }
export const Info: Story = { args: { label: 'Приглашён', variant: 'info' } }
export const Neutral: Story = { args: { label: 'Неактивен', variant: 'neutral' } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge label="Активен" variant="success" />
      <StatusBadge label="Ожидание" variant="warning" />
      <StatusBadge label="Ошибка" variant="error" />
      <StatusBadge label="Приглашён" variant="info" />
      <StatusBadge label="Неактивен" variant="neutral" />
    </div>
  ),
}
