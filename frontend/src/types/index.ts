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

export type AiTaskType = 'summary' | 'grammar' | 'bullets' | 'projects' | 'experience' | 'verbs' | 'tone' | 'career' | 'rewrite'

export interface AiTaskResponse {
  task: string
  result: Record<string, unknown>
}

export const AI_TASK_LABELS: Record<AiTaskType, string> = {
  summary: 'Summary',
  grammar: 'Grammar',
  bullets: 'Bullets',
  projects: 'Projects',
  experience: 'Experience',
  verbs: 'Verbs',
  tone: 'Tone',
  career: 'Career',
  rewrite: 'Rewrite',
}

export interface JdMatchResult {
  matchPercentage: number
  matchingSkills: string[]
  missingSkills: string[]
  matchingKeywords: string[]
  missingKeywords: string[]
  keywordMatchPercentage: number
  suggestions: string[]
  jdText: string
  createdAt: string
}

export interface AtsScore {
  overall: number
  contact: number
  skills: number
  experience: number
  projects: number
  education: number
  keywords: number
  formatting: number
  readability: number
  weakAreas: string[]
  strongAreas: string[]
  recommendations: string[]
}

export interface HealthCheck {
  status: string
  timestamp: string
  uptime: number
}
