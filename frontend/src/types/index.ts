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
  parsedData?: string
  createdAt: string
  updatedAt: string
}

export interface ParsedResume {
  name: string
  email: string
  phone: string
  location: string
  linkedIn: string
  github: string
  portfolio: string
  skills: string[]
  education: Education[]
  experience: Experience[]
  projects: Project[]
  certifications: string[]
  languages: string[]
  achievements: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa: string
}

export interface Experience {
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  description: string[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  url: string
}

export interface HealthCheck {
  status: string
  timestamp: string
  uptime: number
}
