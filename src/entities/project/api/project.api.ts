import { mockList, mockItem, type MockRequestOptions } from '@/shared/api/mock-request'
import { MOCK_PROJECTS } from '../model/mock-data'
import type { Project } from '../model/types'

let projectsState = [...MOCK_PROJECTS]

export const projectApi = {
  getProjects: (options?: MockRequestOptions) =>
    mockList([...projectsState], options),

  getProject: (id: string, options?: MockRequestOptions) => {
    const project = projectsState.find((p) => p.id === id)
    if (!project) return Promise.reject(new Error('Проект не найден'))
    return mockItem(project, options)
  },

  updateProject: (id: string, data: Partial<Project>, options?: MockRequestOptions) => {
    projectsState = projectsState.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString().split('T')[0] } : p,
    )
    const updated = projectsState.find((p) => p.id === id)!
    return mockItem(updated, options)
  },
}
