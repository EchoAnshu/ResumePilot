export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
  }
}

export interface HealthData {
  status: string
  timestamp: string
  uptime: number
}

export interface ResumeMetadata {
  id: string
  originalName: string
  filename: string
  mimeType: string
  size: number
  createdAt: Date
  updatedAt: Date
}
