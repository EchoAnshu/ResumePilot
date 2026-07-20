import api from './api'
import type { ApiResponse, JdMatchResult } from '../types'

export async function matchJd(
  resumeId: string,
  jdText: string,
): Promise<ApiResponse<JdMatchResult>> {
  const { data } = await api.post<ApiResponse<JdMatchResult>>(`/resume/${resumeId}/jd/match`, { jdText })
  return data
}

export async function fetchJdMatch(
  resumeId: string,
): Promise<ApiResponse<JdMatchResult | null>> {
  const { data } = await api.get<ApiResponse<JdMatchResult | null>>(`/resume/${resumeId}/jd/match`)
  return data
}
