import { StatusBadge } from '@/shared/ui/status-badge'
import type { UserStatus } from '../model/types'

const STATUS_CONFIG: Record<UserStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  active: { label: 'Активен', variant: 'success' },
  inactive: { label: 'Неактивен', variant: 'neutral' },
  invited: { label: 'Приглашён', variant: 'warning' },
}

interface UserStatusBadgeProps {
  status: UserStatus
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return <StatusBadge label={config.label} variant={config.variant} />
}
