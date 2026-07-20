import api from './api'
import type { ApiResponse, DashboardData } from '../types'

export async function fetchDashboard(): Promise<ApiResponse<DashboardData>> {
  const { data } = await api.get<ApiResponse<DashboardData>>('/dashboard')
  return data
}
