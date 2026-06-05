import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { PageHeader } from './page-header'

const meta: Meta<typeof PageHeader> = {
  title: 'UI/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: { title: 'Заголовок страницы' },
}

export const WithDescription: Story = {
  args: {
    title: 'Таблицы',
    description: 'Управление пользователями и группами',
  },
}

export const WithActions: Story = {
  args: {
    title: 'Пользователи',
    description: 'Список всех пользователей системы',
    actions: <Button>Добавить пользователя</Button>,
  },
}
