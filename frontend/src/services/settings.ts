import api from './api'
import type { ApiResponse } from '../types'

export interface AppSettings {
  theme: string
  aiModel: string
  ollamaHost: string
  autoAnalyze: string
  storagePath: string
  logLevel: string
}

export async function fetchSettings(): Promise<ApiResponse<AppSettings>> {
  const { data } = await api.get<ApiResponse<AppSettings>>('/settings')
  return data
}

export async function updateSetting(key: string, value: string): Promise<ApiResponse<AppSettings>> {
  const { data } = await api.put<ApiResponse<AppSettings>>('/settings', { key, value })
  return data
}

export async function clearCache(): Promise<ApiResponse<{ freedBytes: number }>> {
  const { data } = await api.post<ApiResponse<{ freedBytes: number }>>('/settings/clear-cache')
  return data
}
