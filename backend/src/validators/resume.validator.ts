import { config } from '../config/index.js'
import { AppError } from '../middleware/errorHandler.js'
import { ERROR_CODES } from '../constants/index.js'

export function validateFileType(mimeType: string): void {
  const allowed: readonly string[] = config.allowedMimeTypes
  if (!allowed.includes(mimeType)) {
    throw new AppError(
      400,
      `Invalid file type "${mimeType}". Only PDF and DOCX are allowed.`,
      ERROR_CODES.INVALID_FILE_TYPE,
    )
  }
}

export function validateFileSize(size: number): void {
  if (size > config.maxFileSize) {
    throw new AppError(
      400,
      `File exceeds maximum size of ${config.maxFileSize / 1024 / 1024} MB.`,
      ERROR_CODES.FILE_TOO_LARGE,
    )
  }
}

export function validateFileExtension(filename: string): void {
  const ext = filename.toLowerCase().split('.').pop()
  if (!ext || !['pdf', 'docx'].includes(ext)) {
    throw new AppError(
      400,
      'File must have a .pdf or .docx extension.',
      ERROR_CODES.INVALID_FILE_TYPE,
    )
  }
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_')
}
