import axios from 'axios'
import type { ApiResponse } from '../types'
import { API_BASE_URL } from '../constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred'
    return Promise.reject(new Error(message))
  },
)

export async function fetchHealth(): Promise<ApiResponse> {
  const { data } = await api.get<ApiResponse>('/health')
  return data
}

export default api
