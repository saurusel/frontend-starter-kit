export type ProjectStatus = 'draft' | 'active' | 'paused' | 'completed'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  ownerId: string
  teamId: string
  progress: number
  createdAt: string
  updatedAt: string
}
