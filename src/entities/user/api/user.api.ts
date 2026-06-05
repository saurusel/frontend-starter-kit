import { mockList, mockItem, type MockRequestOptions } from '@/shared/api/mock-request'
import { MOCK_USERS_DATA } from '../model/mock-data'
import type { User } from '../model/types'

let usersState = [...MOCK_USERS_DATA]

export const userApi = {
  getUsers: (options?: MockRequestOptions) =>
    mockList([...usersState], options),

  getUser: (id: string, options?: MockRequestOptions) => {
    const user = usersState.find((u) => u.id === id)
    if (!user) return Promise.reject(new Error('Пользователь не найден'))
    return mockItem(user, options)
  },

  createUser: (data: Omit<User, 'id' | 'createdAt'>, options?: MockRequestOptions) => {
    const newUser: User = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0],
    }
    usersState = [...usersState, newUser]
    return mockItem(newUser, options)
  },

  updateUser: (id: string, data: Partial<User>, options?: MockRequestOptions) => {
    usersState = usersState.map((u) => (u.id === id ? { ...u, ...data } : u))
    const updated = usersState.find((u) => u.id === id)!
    return mockItem(updated, options)
  },

  deleteUser: (id: string, options?: MockRequestOptions) => {
    usersState = usersState.filter((u) => u.id !== id)
    return mockItem({ id }, options)
  },
}
