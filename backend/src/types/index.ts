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

export type AiTaskType = 'summary' | 'grammar' | 'bullets' | 'projects' | 'experience' | 'verbs' | 'tone' | 'career' | 'rewrite'

export interface AiSummaryResult {
  summary: string
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

export interface AiGrammarResult {
  issues: Array<{ type: string; text: string; suggestion: string }>
  overallAssessment: string
}

export interface AiBulletsResult {
  improvements: Array<{ original: string; improved: string; reason: string }>
}

export interface AiProjectsResult {
  improvements: Array<{ original: string; improved: string; reason: string }>
}

export interface AiExperienceResult {
  improvements: Array<{ original: string; improved: string; reason: string }>
}

export interface AiActionVerbsResult {
  suggestions: Array<{ original: string; suggested: string; context: string }>
}

export interface AiToneResult {
  assessment: string
  suggestions: string[]
}

export interface AiCareerResult {
  suggestedRoles: string[]
  skillGaps: string[]
  recommendations: string[]
}

export interface AiRewriteResult {
  rewrittenResume: string
  changes: string[]
}

export type AiTaskResult =
  | AiSummaryResult
  | AiGrammarResult
  | AiBulletsResult
  | AiProjectsResult
  | AiExperienceResult
  | AiActionVerbsResult
  | AiToneResult
  | AiCareerResult
  | AiRewriteResult

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
