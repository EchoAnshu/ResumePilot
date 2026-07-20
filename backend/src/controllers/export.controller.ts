import type { Request, Response, NextFunction } from 'express'
import * as exportService from '../services/export.service.js'
import type { ApiResponse } from '../types/index.js'
import { validateId } from '../security/validate.js'

const VALID_FORMATS = ['json', 'markdown', 'pdf'] as const

function getValidatedId(req: Request): string {
  const id = req.params.id
  validateId(typeof id === 'string' ? id : id?.[0])
  return typeof id === 'string' ? id : id[0]
}

export async function exportReport(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const format = (req.query.format as string) || 'json'

    if (!VALID_FORMATS.includes(format as typeof VALID_FORMATS[number])) {
      const response: ApiResponse = {
        success: false,
        message: `Invalid format. Valid formats: ${VALID_FORMATS.join(', ')}`,
        error: { code: 'VALIDATION_ERROR' },
      }
      res.status(400).json(response)
      return
    }

    const result = await exportService.exportReport(
      getValidatedId(req),
      format as 'json' | 'markdown' | 'pdf',
    )

    res.setHeader('Content-Type', result.mimeType)
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`)
    res.send(result.content)
  } catch (error) {
    next(error)
  }
}
