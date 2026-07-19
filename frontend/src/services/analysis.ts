import api from './api'
import type { ApiResponse, AtsScore } from '../types'

export async function fetchAnalysis(id: string): Promise<ApiResponse<{ atsScore: AtsScore | null }>> {
  const { data } = await api.get<ApiResponse<{ atsScore: AtsScore | null }>>(`/resume/${id}/analysis`)
  return data
}

export async function triggerAnalysis(id: string): Promise<ApiResponse<{ atsScore: AtsScore }>> {
  const { data } = await api.post<ApiResponse<{ atsScore: AtsScore }>>(`/resume/${id}/analyze`)
  return data
}
