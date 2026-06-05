import type { User } from './types'

export const MOCK_USERS_DATA: User[] = [
  { id: '1', name: 'Алексей Смирнов', email: 'alexey@example.com', role: 'admin', status: 'active', team: 'Разработка', createdAt: '2024-01-15' },
  { id: '2', name: 'Мария Петрова', email: 'maria@example.com', role: 'manager', status: 'active', team: 'Продукт', createdAt: '2024-02-10' },
  { id: '3', name: 'Иван Козлов', email: 'ivan@example.com', role: 'user', status: 'active', team: 'Разработка', createdAt: '2024-03-05' },
  { id: '4', name: 'Анна Новикова', email: 'anna@example.com', role: 'user', status: 'inactive', team: 'Дизайн', createdAt: '2024-03-20' },
  { id: '5', name: 'Дмитрий Волков', email: 'dmitry@example.com', role: 'manager', status: 'active', team: 'Аналитика', createdAt: '2024-04-01' },
  { id: '6', name: 'Елена Морозова', email: 'elena@example.com', role: 'user', status: 'invited', team: 'Продукт', createdAt: '2024-04-15' },
  { id: '7', name: 'Сергей Лебедев', email: 'sergey@example.com', role: 'user', status: 'active', team: 'Разработка', createdAt: '2024-05-02' },
  { id: '8', name: 'Наталья Соколова', email: 'natalia@example.com', role: 'manager', status: 'active', team: 'Маркетинг', createdAt: '2024-05-18' },
  { id: '9', name: 'Павел Орлов', email: 'pavel@example.com', role: 'user', status: 'active', team: 'Дизайн', createdAt: '2024-06-01' },
  { id: '10', name: 'Ольга Медведева', email: 'olga@example.com', role: 'user', status: 'inactive', team: 'Аналитика', createdAt: '2024-06-10' },
  { id: '11', name: 'Андрей Захаров', email: 'andrey@example.com', role: 'user', status: 'active', team: 'Разработка', createdAt: '2024-07-03' },
  { id: '12', name: 'Татьяна Федорова', email: 'tatyana@example.com', role: 'user', status: 'invited', team: 'Маркетинг', createdAt: '2024-07-20' },
]
