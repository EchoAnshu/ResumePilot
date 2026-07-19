export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
  }
}

export interface Resume {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  createdAt: string
  updatedAt: string
}

export interface HealthCheck {
  status: string
  timestamp: string
  uptime: number
}
