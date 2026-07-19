export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  PARSER_ERROR: 'PARSER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
} as const

export const ANALYSIS_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const

export const ATS_WEIGHTS = {
  contact: 10,
  skills: 20,
  experience: 25,
  projects: 15,
  education: 10,
  keywords: 10,
  formatting: 5,
  readability: 5,
} as const
