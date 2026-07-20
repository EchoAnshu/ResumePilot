export const API_BASE_URL = '/api'

export const APP_NAME = 'ResumePilot'

export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  upload: '/upload',
  analysis: '/analysis/:id',
  jdMatch: '/analysis/:id/jd-match',
  interview: '/analysis/:id/interview',
  settings: '/settings',
  about: '/about',
} as const

export const FILE_LIMITS = {
  maxSizeMB: 10,
  allowedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const
