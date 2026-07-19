import type { Request, Response, NextFunction } from 'express'
import * as atsService from '../services/ats.service.js'
import type { ApiResponse, AtsScore } from '../types/index.js'
import { validateId } from '../security/validate.js'

function getId(req: Request): string {
  const id = req.params.id
  if (Array.isArray(id)) return id[0]
  return id
}

function getValidatedId(req: Request): string {
  const id = getId(req)
  validateId(id)
  return id
}

export async function getAtsAnalysis(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await atsService.getAnalysis(getValidatedId(req))

    const response: ApiResponse<{ atsScore: AtsScore | null }> = {
      success: true,
      message: result.atsScore ? 'ATS analysis found.' : 'No ATS analysis yet.',
      data: result,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export async function triggerAtsAnalysis(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const atsScore = await atsService.analyzeResume(getValidatedId(req))

    const response: ApiResponse<{ atsScore: AtsScore }> = {
      success: true,
      message: 'ATS analysis completed.',
      data: { atsScore },
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}
