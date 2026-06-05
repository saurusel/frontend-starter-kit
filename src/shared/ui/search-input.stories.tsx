import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SearchInput } from './search-input'

const meta: Meta<typeof SearchInput> = {
  title: 'UI/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SearchInput>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-64">
        <SearchInput value={value} onChange={setValue} placeholder="Поиск..." />
        {value && <p className="mt-2 text-sm text-muted-foreground">Запрос: {value}</p>}
      </div>
    )
  },
}

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState('admin')
    return (
      <div className="w-64">
        <SearchInput value={value} onChange={setValue} />
      </div>
    )
  },
}
