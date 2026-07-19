import type { Request, Response, NextFunction } from 'express'
import * as resumeService from '../services/resume.service.js'
import type { ApiResponse } from '../types/index.js'
import type { Resume } from '@prisma/client'
import { validateId } from '../security/validate.js'

export async function uploadResume(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const file = req.file
    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No file provided.',
        error: { code: 'VALIDATION_ERROR' },
      } satisfies ApiResponse)
      return
    }

    const result = await resumeService.uploadResume(file)

    const response: ApiResponse<Resume> = {
      success: true,
      message: 'Resume uploaded successfully.',
      data: result.resume,
    }

    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
}

export async function listResumes(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const resumes = await resumeService.listResumes()

    const response: ApiResponse<Resume[]> = {
      success: true,
      message: 'Resumes retrieved successfully.',
      data: resumes,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export async function getResume(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id
    validateId(id)
    const resume = await resumeService.getResume(id)

    const response: ApiResponse<Resume> = {
      success: true,
      message: 'Resume retrieved successfully.',
      data: resume,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export async function deleteResume(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id
    validateId(id)
    await resumeService.deleteResume(id)

    const response: ApiResponse = {
      success: true,
      message: 'Resume deleted successfully.',
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export async function replaceResume(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id
    validateId(id)

    const file = req.file
    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No file provided.',
        error: { code: 'VALIDATION_ERROR' },
      } satisfies ApiResponse)
      return
    }

    const result = await resumeService.replaceResume(id, file)

    const response: ApiResponse<Resume> = {
      success: true,
      message: 'Resume replaced successfully.',
      data: result.resume,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}
