import type { AnalyticsDashboard, ChartPeriod } from './types'

function generateDates(days: number): string[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return d.toISOString().split('T')[0]
  })
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getMockAnalytics(period: ChartPeriod): AnalyticsDashboard {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const dates = generateDates(days)

  return {
    metrics: [
      { id: '1', title: 'Пользователи', value: 1284, change: 12.5, unit: '' },
      { id: '2', title: 'Проекты', value: 57, change: -3.2, unit: '' },
      { id: '3', title: 'Заявки', value: 340, change: 8.1, unit: '' },
      { id: '4', title: 'Выполнено задач', value: 892, change: 22.4, unit: '' },
    ],
    lineData: dates.map((date) => ({
      date,
      value: randomInRange(40, 120),
      value2: randomInRange(20, 80),
    })),
    barData: dates.slice(-10).map((date) => ({
      date,
      value: randomInRange(10, 60),
      value2: randomInRange(5, 40),
    })),
    pieData: [
      { name: 'Администраторы', value: 5 },
      { name: 'Менеджеры', value: 23 },
      { name: 'Пользователи', value: 72 },
    ],
  }
}
