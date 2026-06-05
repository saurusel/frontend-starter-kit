export type RequestStatus = 'new' | 'in_progress' | 'approved' | 'rejected'
export type RequestPriority = 'low' | 'medium' | 'high'

export interface RequestItem {
  id: string
  title: string
  description: string
  status: RequestStatus
  priority: RequestPriority
  authorId: string
  assigneeId?: string
  createdAt: string
}
