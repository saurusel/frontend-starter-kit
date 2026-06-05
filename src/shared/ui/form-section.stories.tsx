import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'
import { Button } from './button'
import { FormSection, FormFieldWrapper, FormActions } from './form-section'

const meta: Meta = {
  title: 'UI/FormSection',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <FormSection title="Основные данные" description="Введите базовую информацию">
        <FormFieldWrapper label="Имя" htmlFor="name" required>
          <Input id="name" placeholder="Иван Петров" />
        </FormFieldWrapper>
        <FormFieldWrapper label="Email" htmlFor="email" required>
          <Input id="email" type="email" placeholder="ivan@example.com" />
        </FormFieldWrapper>
      </FormSection>

      <FormActions>
        <Button>Сохранить</Button>
        <Button variant="outline">Отмена</Button>
      </FormActions>
    </div>
  ),
}

export const WithErrors: Story = {
  render: () => (
    <div className="max-w-md">
      <FormSection title="Форма с ошибками">
        <FormFieldWrapper
          label="Email"
          htmlFor="email-err"
          required
          error="Введите корректный email"
        >
          <Input id="email-err" defaultValue="не email" />
        </FormFieldWrapper>
        <FormFieldWrapper
          label="Пароль"
          htmlFor="pwd"
          required
          hint="Минимум 8 символов"
        >
          <Input id="pwd" type="password" />
        </FormFieldWrapper>
      </FormSection>
    </div>
  ),
}
