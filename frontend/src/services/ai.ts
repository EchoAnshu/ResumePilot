import api from './api'
import type { ApiResponse, AiTaskType, AiTaskResponse } from '../types'

export async function triggerAiTask(
  resumeId: string,
  task: AiTaskType,
): Promise<ApiResponse<AiTaskResponse>> {
  const { data } = await api.post<ApiResponse<AiTaskResponse>>(
    `/resume/${resumeId}/ai/${task}`,
  )
  return data
}
