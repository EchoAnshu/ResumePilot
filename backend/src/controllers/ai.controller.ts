import type { Request, Response, NextFunction } from 'express'
import * as aiService from '../services/ai.service.js'
import type { ApiResponse, AiTaskType } from '../types/index.js'
import { AI_TASKS } from '../constants/index.js'
import { validateId } from '../security/validate.js'

function isValidAiTask(value: string): value is AiTaskType {
  return Object.values(AI_TASKS).includes(value as AiTaskType)
}

function getValidatedId(req: Request): string {
  const id = req.params.id
  validateId(typeof id === 'string' ? id : id?.[0])
  return typeof id === 'string' ? id : id[0]
}

function getTask(req: Request): string {
  const task = req.params.task
  if (Array.isArray(task)) return task[0]
  return task
}

export async function runAiTask(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const resumeId = getValidatedId(req)
    const taskStr = getTask(req)

    if (!isValidAiTask(taskStr)) {
      const response: ApiResponse = {
        success: false,
        message: `Invalid AI task. Valid tasks: ${Object.values(AI_TASKS).join(', ')}`,
        error: { code: 'VALIDATION_ERROR' },
      }
      res.status(400).json(response)
      return
    }

    const task: AiTaskType = taskStr
    const saved = await aiService.getAiTaskResult(resumeId, task)
    if (saved) {
      const response: ApiResponse<Record<string, unknown>> = {
        success: true,
        message: 'AI task result retrieved from cache.',
        data: { task, result: saved },
      }
      res.json(response)
      return
    }

    const result = await aiService.runAiTask(resumeId, task)
    await aiService.saveAiTaskResult(resumeId, task, result)

    const response: ApiResponse<Record<string, unknown>> = {
      success: true,
      message: 'AI analysis completed.',
      data: { task, result },
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}
