import type { Request, Response, NextFunction } from 'express'
import * as jdService from '../services/jd.service.js'
import type { ApiResponse, JdMatchResult } from '../types/index.js'
import { validateId, validateNonEmptyString, sanitizeText } from '../security/validate.js'

function getValidatedId(req: Request): string {
  const id = req.params.id
  validateId(typeof id === 'string' ? id : id?.[0])
  return typeof id === 'string' ? id : id[0]
}

export async function matchJd(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const resumeId = getValidatedId(req)
    validateNonEmptyString(req.body?.jdText, 'Job description text', 50_000)
    const jdText = sanitizeText(req.body.jdText)

    const result = await jdService.matchWithJd(resumeId, jdText)

    const response: ApiResponse<JdMatchResult> = {
      success: true,
      message: 'JD match completed.',
      data: result,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export async function getMatchResult(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await jdService.getLatestMatch(getValidatedId(req))

    const response: ApiResponse<JdMatchResult | null> = {
      success: true,
      message: result ? 'JD match result found.' : 'No JD match result yet.',
      data: result,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}
