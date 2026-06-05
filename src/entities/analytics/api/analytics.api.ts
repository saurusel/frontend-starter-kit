import { mockItem, type MockRequestOptions } from '@/shared/api/mock-request'
import { getMockAnalytics } from '../model/mock-data'
import type { ChartPeriod } from '../model/types'

export const analyticsApi = {
  getDashboard: (period: ChartPeriod = '30d', options?: MockRequestOptions) =>
    mockItem(getMockAnalytics(period), options),
}
