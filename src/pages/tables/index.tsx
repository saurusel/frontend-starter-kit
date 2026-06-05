import { useState } from 'react'
import { MoreHorizontal, Plus, Trash2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/shared/ui/page-header'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { DataTable } from '@/shared/ui/data-table/data-table'
import type { Column } from '@/shared/ui/data-table/types'
import { UserStatusBadge } from '@/entities/user/ui/user-status-badge'
import { useUsers, useDeleteUser } from '@/entities/user/model/user.queries'
import { useSessionStore } from '@/entities/session/model/session-store'
import type { User } from '@/entities/user/model/types'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Администратор',
  manager: 'Менеджер',
  user: 'Пользователь',
}

export default function TablesPage() {
  const hasPermission = useSessionStore((s) => s.hasPermission)
  const { data: users = [], isLoading, error } = useUsers()
  const deleteUser = useDeleteUser()

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [search, setSearch] = useState('')

  const canCreate = hasPermission('users:create')
  const canUpdate = hasPermission('users:update')
  const canDelete = hasPermission('users:delete')

  const columns: Column<User>[] = [
    { key: 'name', header: 'Имя', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'role',
      header: 'Роль',
      cell: (row) => ROLE_LABELS[row.role] || row.role,
      sortable: true,
    },
    {
      key: 'status',
      header: 'Статус',
      cell: (row) => <UserStatusBadge status={row.status} />,
      sortable: true,
    },
    { key: 'team', header: 'Команда', sortable: true },
    { key: 'createdAt', header: 'Дата создания', sortable: true },
  ]

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteUser.mutateAsync(deleteTarget)
    toast.success('Пользователь удалён')
    setDeleteTarget(null)
    setSelectedIds(new Set())
  }

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteUser.mutateAsync(id)
    }
    toast.success(`Удалено: ${selectedIds.size}`)
    setSelectedIds(new Set())
    setBulkDeleteOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Таблицы"
        description="Пример таблицы с поиском, фильтрами, сортировкой и массовыми действиями"
        actions={
          canCreate && (
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Добавить
            </Button>
          )
        }
      />

      <DataTable
        data={users}
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        error={error ? 'Не удалось загрузить список пользователей' : null}
        emptyTitle="Нет пользователей"
        emptyDescription="Пользователи не найдены"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по имени, email..."
        selectedIds={canDelete ? selectedIds : undefined}
        onSelectionChange={canDelete ? setSelectedIds : undefined}
        bulkActions={
          canDelete ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить выбранные
            </Button>
          ) : undefined
        }
        rowActions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Действия</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canUpdate && (
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Редактировать
                </DropdownMenuItem>
              )}
              {canUpdate && canDelete && <DropdownMenuSeparator />}
              {canDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteTarget(row.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить пользователя?"
        description="Это действие нельзя отменить."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteUser.isPending}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Удалить ${selectedIds.size} пользователей?`}
        description="Это действие нельзя отменить."
        confirmLabel="Удалить всех"
        variant="destructive"
        onConfirm={handleBulkDelete}
        isLoading={deleteUser.isPending}
      />
    </div>
  )
}
