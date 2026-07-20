import type { Request, Response, NextFunction } from 'express'
import { logger } from '../config/logger.js'
import { ERROR_CODES } from '../constants/index.js'
import type { ApiResponse } from '../types/index.js'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string = ERROR_CODES.INTERNAL_ERROR,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

const MULTER_CODES: Record<string, { status: number; message: string }> = {
  LIMIT_FILE_SIZE: { status: 413, message: 'File is too large. Maximum size is 10 MB.' },
  LIMIT_FILE_COUNT: { status: 400, message: 'Too many files uploaded.' },
  LIMIT_UNEXPECTED_FILE: { status: 400, message: 'Unexpected file field.' },
  LIMIT_FIELD_KEY: { status: 400, message: 'Field name too long.' },
  LIMIT_FIELD_VALUE: { status: 400, message: 'Field value too long.' },
  LIMIT_FIELD_COUNT: { status: 400, message: 'Too many fields.' },
  LIMIT_PART_COUNT: { status: 400, message: 'Too many parts.' },
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      message: err.message,
      error: { code: err.code },
    }
    res.status(err.statusCode).json(response)
    return
  }

  if (err.name === 'MulterError') {
    const code = (err as any).code || 'UNKNOWN'
    const mapping = MULTER_CODES[code]
    const response: ApiResponse = {
      success: false,
      message: mapping?.message || 'Upload error.',
      error: { code },
    }
    res.status(mapping?.status || 400).json(response)
    return
  }

  logger.error('Unhandled error', { error: err.message, stack: err.stack })

  const response: ApiResponse = {
    success: false,
    message: 'An internal error occurred',
    error: { code: ERROR_CODES.INTERNAL_ERROR },
  }
  res.status(500).json(response)
}
