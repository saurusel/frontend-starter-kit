import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '../api/analytics.api'
import type { ChartPeriod } from './types'

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: (period: ChartPeriod) => [...analyticsKeys.all, 'dashboard', period] as const,
}

export function useAnalyticsDashboard(period: ChartPeriod = '30d') {
  return useQuery({
    queryKey: analyticsKeys.dashboard(period),
    queryFn: () => analyticsApi.getDashboard(period),
  })
}
