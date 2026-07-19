import type { Request, Response, NextFunction } from 'express'
import * as resumeService from '../services/resume.service.js'
import type { ApiResponse, ParsedResume } from '../types/index.js'
import { validateId } from '../security/validate.js'

function getValidatedId(req: Request): string {
  const id = req.params.id
  validateId(typeof id === 'string' ? id : id?.[0])
  return typeof id === 'string' ? id : id[0]
}

export async function getParsedResume(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = await resumeService.getParsedResume(getValidatedId(req))

    const response: ApiResponse<ParsedResume> = {
      success: true,
      message: 'Resume parsed successfully.',
      data: parsed,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export async function reparseResume(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = await resumeService.triggerReparse(getValidatedId(req))

    const response: ApiResponse<ParsedResume> = {
      success: true,
      message: 'Resume re-parsed successfully.',
      data: parsed,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}
