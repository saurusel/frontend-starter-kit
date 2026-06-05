import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = { args: { placeholder: 'Введите значение...' } }
export const Password: Story = { args: { type: 'password', placeholder: 'Пароль' } }
export const Disabled: Story = { args: { placeholder: 'Disabled', disabled: true } }
export const WithValue: Story = { args: { defaultValue: 'Текст' } }
