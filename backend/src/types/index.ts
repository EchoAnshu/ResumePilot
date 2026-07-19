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

export interface ParsedResume {
  name: string | null
  email: string | null
  phone: string | null
  location: string | null
  linkedIn: string | null
  github: string | null
  portfolio: string | null
  skills: string[]
  education: EducationEntry[]
  experience: ExperienceEntry[]
  projects: ProjectEntry[]
  certifications: string[]
  languages: string[]
  achievements: string[]
}

export interface EducationEntry {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa: string
}

export interface ExperienceEntry {
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  description: string[]
}

export interface ProjectEntry {
  name: string
  description: string
  technologies: string[]
  url: string
}
