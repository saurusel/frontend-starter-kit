import { create } from 'zustand'

interface PanelState {
  isOpen: boolean
  isPinned: boolean
  selectedId: string | null
  open: (id?: string) => void
  close: () => void
  togglePin: () => void
  setSelectedId: (id: string | null) => void
}

export const usePanelStore = create<PanelState>((set) => ({
  isOpen: false,
  isPinned: false,
  selectedId: null,

  open: (id) => set({ isOpen: true, selectedId: id ?? null }),
  close: () => set((s) => ({ isOpen: s.isPinned ? true : false })),
  togglePin: () => set((s) => ({ isPinned: !s.isPinned })),
  setSelectedId: (id) => set({ selectedId: id }),
}))
