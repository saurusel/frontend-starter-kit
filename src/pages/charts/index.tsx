import { useState } from 'react'
import { PageHeader } from '@/shared/ui/page-header'
import { PageLoader } from '@/shared/ui/states/page-loader'
import { PageError } from '@/shared/ui/states/page-error'
import {
  ChartCard,
  PeriodToggle,
  LineChart,
  BarChart,
  AreaChart,
  DonutChart,
} from '@/shared/ui/charts'
import { useAnalyticsDashboard } from '@/entities/analytics/model/analytics.queries'
import type { ChartPeriod } from '@/entities/analytics/model/types'

export default function ChartsPage() {
  const [period, setPeriod] = useState<ChartPeriod>('30d')
  const { data, isLoading, isError, refetch } = useAnalyticsDashboard(period)

  if (isLoading) return <PageLoader />
  if (isError) return <PageError onRetry={refetch} />

  const toggle = <PeriodToggle value={period} onChange={setPeriod} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Графики"
        description="Визуализация данных — Line, Bar, Area, Donut"
        actions={toggle}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Линейный график"
          description="Динамика двух показателей по времени"
        >
          <LineChart
            data={data!.lineData}
            lines={[
              { key: 'value', name: 'Показатель 1' },
              { key: 'value2', name: 'Показатель 2' },
            ]}
          />
        </ChartCard>

        <ChartCard
          title="Столбчатый график"
          description="Сравнение значений за последние 10 периодов"
        >
          <BarChart
            data={data!.barData}
            bars={[
              { key: 'value', name: 'Серия A' },
              { key: 'value2', name: 'Серия B' },
            ]}
          />
        </ChartCard>

        <ChartCard
          title="Area-график"
          description="Накопительная динамика показателей"
        >
          <AreaChart
            data={data!.lineData}
            areas={[
              { key: 'value', name: 'Поток 1' },
              { key: 'value2', name: 'Поток 2' },
            ]}
          />
        </ChartCard>

        <ChartCard
          title="Donut-диаграмма"
          description="Распределение пользователей по ролям"
        >
          <DonutChart data={data!.pieData} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Столбчатый (накопительный)"
          description="Stacked bar — суммирование значений"
        >
          <BarChart
            data={data!.barData}
            bars={[
              { key: 'value', name: 'Категория A' },
              { key: 'value2', name: 'Категория B' },
            ]}
            stacked
          />
        </ChartCard>

        <ChartCard
          title="Area (накопительный)"
          description="Stacked area — суммирование потоков"
        >
          <AreaChart
            data={data!.lineData.slice(-14)}
            areas={[
              { key: 'value', name: 'Входящие' },
              { key: 'value2', name: 'Исходящие' },
            ]}
            stacked
          />
        </ChartCard>
      </div>
    </div>
  )
}
