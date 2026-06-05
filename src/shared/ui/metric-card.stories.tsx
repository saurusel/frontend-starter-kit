import type { Meta, StoryObj } from '@storybook/react'
import { TrendingUp } from 'lucide-react'
import { MetricCard } from './metric-card'

const meta: Meta<typeof MetricCard> = {
  title: 'UI/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MetricCard>

export const Positive: Story = {
  args: { title: 'Пользователи', value: '1 284', change: 12.5 },
}

export const Negative: Story = {
  args: { title: 'Отказы', value: '57', change: -3.2 },
}

export const WithIcon: Story = {
  args: {
    title: 'Выполнено',
    value: '892',
    change: 22.4,
    icon: <TrendingUp className="h-4 w-4" />,
  },
}

export const WithUnit: Story = {
  args: { title: 'Выручка', value: '1 500 000', change: 8.1, unit: '₽' },
}
