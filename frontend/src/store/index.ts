import { create } from 'zustand'
import * as resumeService from '../services/resume'
import { fetchDashboard } from '../services/dashboard'
import type { Resume, DashboardData } from '../types'

interface AppState {
  theme: 'light' | 'dark'
  resumes: Resume[]
  dashboard: DashboardData | null
  isLoading: boolean
  error: string | null
  toggleTheme: () => void
  loadResumes: () => Promise<void>
  loadDashboard: () => Promise<void>
  uploadResume: (file: File, onProgress?: (pct: number) => void) => Promise<Resume>
  deleteResume: (id: string) => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  resumes: [],
  dashboard: null,
  isLoading: false,
  error: null,

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      return { theme: next }
    }),

  loadResumes: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await resumeService.fetchResumes()
      set({ resumes: res.data ?? [], isLoading: false })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load resumes', isLoading: false })
    }
  },

  loadDashboard: async () => {
    try {
      const res = await fetchDashboard()
      if (res.data) {
        set({ dashboard: res.data })
      }
    } catch {
      // dashboard load failed silently
    }
  },

  uploadResume: async (file, onProgress) => {
    const res = await resumeService.uploadResume(file, onProgress)
    if (res.data) {
      set((state) => ({ resumes: [res.data!, ...state.resumes] }))
    }
    return res.data!
  },

  deleteResume: async (id) => {
    await resumeService.deleteResume(id)
    set((state) => ({ resumes: state.resumes.filter((r) => r.id !== id) }))
  },
}))
