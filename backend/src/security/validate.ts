import path from 'node:path'
import { AppError } from '../middleware/errorHandler.js'
import { ERROR_CODES } from '../constants/index.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function validateId(id: unknown): asserts id is string {
  if (typeof id !== 'string' || !UUID_RE.test(id)) {
    throw new AppError(400, 'Invalid resume ID format.', ERROR_CODES.VALIDATION_ERROR)
  }
}

export function validateNonEmptyString(
  value: unknown,
  name: string,
  maxLength = 10_000,
): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AppError(400, `${name} is required and must be a non-empty string.`, ERROR_CODES.VALIDATION_ERROR)
  }
  if (value.length > maxLength) {
    throw new AppError(400, `${name} exceeds maximum length of ${maxLength} characters.`, ERROR_CODES.VALIDATION_ERROR)
  }
}

export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .trim()
}

export function ensurePathWithin(dir: string, target: string): string {
  const resolved = path.resolve(dir, target)
  if (!resolved.startsWith(path.resolve(dir))) {
    throw new AppError(400, 'Invalid file path.', ERROR_CODES.VALIDATION_ERROR)
  }
  return resolved
}
