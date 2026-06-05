export interface MetricCard {
  id: string
  title: string
  value: number
  change: number
  unit?: string
}

export interface ChartDataPoint {
  date: string
  value: number
  value2?: number
}

export interface PieDataPoint {
  name: string
  value: number
}

export interface AnalyticsDashboard {
  metrics: MetricCard[]
  lineData: ChartDataPoint[]
  barData: ChartDataPoint[]
  pieData: PieDataPoint[]
}

export type ChartPeriod = '7d' | '30d' | '90d'
