import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FolderOpen, FileText, CheckSquare, Plus, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/shared/ui/page-header'
import { MetricCard } from '@/shared/ui/metric-card'
import { SectionCard } from '@/shared/ui/section-card'
import { Button } from '@/shared/ui/button'
import { PageLoader } from '@/shared/ui/states/page-loader'
import { PageError } from '@/shared/ui/states/page-error'
import { LineChart, AreaChart, DonutChart, PeriodToggle } from '@/shared/ui/charts'
import { useAnalyticsDashboard } from '@/entities/analytics/model/analytics.queries'
import { useUsers } from '@/entities/user/model/user.queries'
import { UserStatusBadge } from '@/entities/user/ui/user-status-badge'
import { ROUTES } from '@/shared/config/route-paths'
import type { ChartPeriod } from '@/entities/analytics/model/types'

export default function DashboardPage() {
  const [period, setPeriod] = useState<ChartPeriod>('30d')
  const navigate = useNavigate()

  const { data: analytics, isLoading, isError, refetch } = useAnalyticsDashboard(period)
  const { data: users } = useUsers()

  if (isLoading) return <PageLoader />
  if (isError) return <PageError onRetry={refetch} />

  const metricIcons = [
    <Users className="h-4 w-4" />,
    <FolderOpen className="h-4 w-4" />,
    <FileText className="h-4 w-4" />,
    <CheckSquare className="h-4 w-4" />,
  ]

  const recentUsers = users?.slice(0, 5) ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Главная панель"
        description="Обзор ключевых показателей и последних событий"
        actions={
          <Button onClick={() => navigate(ROUTES.TABLES)}>
            <Plus className="mr-2 h-4 w-4" />
            Новый пользователь
          </Button>
        }
      />

      {/* KPI метрики */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {analytics!.metrics.map((metric, i) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value.toLocaleString('ru')}
            change={metric.change}
            icon={metricIcons[i]}
          />
        ))}
      </div>

      {/* Графики */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Активность за период"
          description="Динамика основных показателей"
          actions={<PeriodToggle value={period} onChange={setPeriod} />}
        >
          <AreaChart
            data={analytics!.lineData}
            areas={[
              { key: 'value', name: 'Показатель 1' },
              { key: 'value2', name: 'Показатель 2' },
            ]}
            height={220}
          />
        </SectionCard>

        <SectionCard title="Распределение ролей" description="Состав пользователей">
          <DonutChart data={analytics!.pieData} height={220} innerRadius={50} outerRadius={80} />
        </SectionCard>
      </div>

      {/* Тренд + последние пользователи */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Недельный тренд" description="Показатели за последние 7 дней">
          <LineChart
            data={analytics!.lineData.slice(-7)}
            lines={[
              { key: 'value', name: 'Факт' },
              { key: 'value2', name: 'План' },
            ]}
            height={220}
          />
        </SectionCard>

        <SectionCard
          title="Последние пользователи"
          description={`${recentUsers.length} из ${users?.length ?? 0}`}
          actions={
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.TABLES)}>
              Все <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          }
        >
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <UserStatusBadge status={user.status} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
