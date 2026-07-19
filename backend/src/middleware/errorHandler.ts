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

  logger.error('Unhandled error', { error: err.message, stack: err.stack })

  const response: ApiResponse = {
    success: false,
    message: 'An internal error occurred',
    error: { code: ERROR_CODES.INTERNAL_ERROR },
  }
  res.status(500).json(response)
}
