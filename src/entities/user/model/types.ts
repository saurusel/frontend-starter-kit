export type UserStatus = 'active' | 'inactive' | 'invited'
export type UserRole = 'admin' | 'manager' | 'user'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  team: string
  createdAt: string
}
