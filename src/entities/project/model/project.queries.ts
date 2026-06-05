import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectApi } from '../api/project.api'
import type { Project } from './types'

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectApi.getProjects() as Promise<Project[]>,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectApi.getProject(id) as Promise<Project>,
    enabled: !!id,
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectApi.updateProject(id, data) as Promise<Project>,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) })
    },
  })
}
