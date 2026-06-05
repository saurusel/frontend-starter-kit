export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  assigneeId?: string
  dueDate?: string
}
