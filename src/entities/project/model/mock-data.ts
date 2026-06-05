import type { Project } from './types'

export const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Редизайн сайта', description: 'Полный редизайн корпоративного сайта', status: 'active', ownerId: '2', teamId: 't1', progress: 65, createdAt: '2024-01-10', updatedAt: '2024-06-01' },
  { id: '2', name: 'Мобильное приложение', description: 'Разработка мобильного приложения для клиентов', status: 'active', ownerId: '1', teamId: 't2', progress: 40, createdAt: '2024-02-15', updatedAt: '2024-06-05' },
  { id: '3', name: 'Аналитическая платформа', description: 'Внутренняя платформа для анализа данных', status: 'paused', ownerId: '5', teamId: 't3', progress: 80, createdAt: '2024-03-01', updatedAt: '2024-05-20' },
  { id: '4', name: 'CRM-интеграция', description: 'Интеграция с внешней CRM-системой', status: 'completed', ownerId: '2', teamId: 't1', progress: 100, createdAt: '2024-01-05', updatedAt: '2024-04-30' },
  { id: '5', name: 'PWA-кэшировние', description: 'Настройка offline-режима для приложения', status: 'draft', ownerId: '3', teamId: 't2', progress: 10, createdAt: '2024-07-01', updatedAt: '2024-07-01' },
]
