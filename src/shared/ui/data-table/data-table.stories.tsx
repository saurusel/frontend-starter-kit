import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './data-table'
import type { Column } from './types'

interface SampleRow {
  id: string
  name: string
  email: string
  role: string
  status: string
}

const SAMPLE_DATA: SampleRow[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  name: `Пользователь ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ['admin', 'manager', 'user'][i % 3],
  status: ['active', 'inactive', 'invited'][i % 3],
}))

const COLUMNS: Column<SampleRow>[] = [
  { key: 'name', header: 'Имя', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Роль', sortable: true },
  { key: 'status', header: 'Статус', sortable: true },
]

const meta: Meta<typeof DataTable<SampleRow>> = {
  title: 'UI/DataTable',
  component: DataTable,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DataTable<SampleRow>>

export const Default: Story = {
  render: () => (
    <DataTable
      data={SAMPLE_DATA}
      columns={COLUMNS}
      keyField="id"
    />
  ),
}

export const Loading: Story = {
  render: () => (
    <DataTable
      data={[]}
      columns={COLUMNS}
      keyField="id"
      isLoading
    />
  ),
}

export const Empty: Story = {
  render: () => (
    <DataTable
      data={[]}
      columns={COLUMNS}
      keyField="id"
      emptyTitle="Нет данных"
      emptyDescription="Список пуст"
    />
  ),
}

export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string>>(new Set())
    return (
      <div>
        <DataTable
          data={SAMPLE_DATA.slice(0, 5)}
          columns={COLUMNS}
          keyField="id"
          selectedIds={selected}
          onSelectionChange={setSelected}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Выбрано: {selected.size}
        </p>
      </div>
    )
  },
}
