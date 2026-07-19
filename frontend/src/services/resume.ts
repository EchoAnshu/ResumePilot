import api from './api'
import type { ApiResponse, Resume } from '../types'

export async function uploadResume(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<ApiResponse<Resume>> {
  const formData = new FormData()
  formData.append('resume', file)

  const { data } = await api.post<ApiResponse<Resume>>('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    },
  })

  return data
}

export async function fetchResumes(): Promise<ApiResponse<Resume[]>> {
  const { data } = await api.get<ApiResponse<Resume[]>>('/resumes')
  return data
}

export async function fetchResume(id: string): Promise<ApiResponse<Resume>> {
  const { data } = await api.get<ApiResponse<Resume>>(`/resume/${id}`)
  return data
}

export async function deleteResume(id: string): Promise<ApiResponse> {
  const { data } = await api.delete<ApiResponse>(`/resume/${id}`)
  return data
}

export async function replaceResume(
  id: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<ApiResponse<Resume>> {
  const formData = new FormData()
  formData.append('resume', file)

  const { data } = await api.put<ApiResponse<Resume>>(`/resume/${id}/replace`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    },
  })

  return data
}
