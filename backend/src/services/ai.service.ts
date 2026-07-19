import { logger } from '../config/logger.js'
import { config } from '../config/index.js'
import { AppError } from '../middleware/errorHandler.js'
import { ERROR_CODES } from '../constants/index.js'
import * as resumeRepository from '../repositories/resume.repository.js'
import { parseResume } from '../parsers/resumeParser.js'
import { queryOllama } from '../ai/ollamaClient.js'
import { buildSummaryPrompt } from '../prompts/summary.js'
import { buildGrammarPrompt } from '../prompts/grammar.js'
import { buildBulletsPrompt } from '../prompts/bullets.js'
import { buildProjectsPrompt } from '../prompts/projects.js'
import { buildExperiencePrompt } from '../prompts/experience.js'
import { buildVerbsPrompt } from '../prompts/verbs.js'
import { buildTonePrompt } from '../prompts/tone.js'
import { buildCareerPrompt } from '../prompts/career.js'
import { buildRewritePrompt } from '../prompts/rewrite.js'
import type {
  ParsedResume,
  AiTaskType,
  AiSummaryResult,
  AiGrammarResult,
  AiBulletsResult,
  AiProjectsResult,
  AiExperienceResult,
  AiActionVerbsResult,
  AiToneResult,
  AiCareerResult,
  AiRewriteResult,
  AiTaskResult,
} from '../types/index.js'

const promptBuilders: Record<AiTaskType, (r: ParsedResume) => string> = {
  summary: buildSummaryPrompt,
  grammar: buildGrammarPrompt,
  bullets: buildBulletsPrompt,
  projects: buildProjectsPrompt,
  experience: buildExperiencePrompt,
  verbs: buildVerbsPrompt,
  tone: buildTonePrompt,
  career: buildCareerPrompt,
  rewrite: buildRewritePrompt,
}

async function getParsedResume(id: string): Promise<ParsedResume> {
  const resume = await resumeRepository.findResumeById(id)
  if (!resume) {
    throw new AppError(404, 'Resume not found.', ERROR_CODES.NOT_FOUND)
  }

  let parsedData = resume.parsedData
  if (!parsedData) {
    logger.info('Parsed data not found, parsing resume on demand', { id })
    const parsed = await parseResume(resume.filename, resume.mimeType)
    parsedData = JSON.stringify(parsed)
    await resumeRepository.updateResumeParsedData(resume.id, parsedData)
  }

  return JSON.parse(parsedData) as ParsedResume
}

export async function runAiTask(
  resumeId: string,
  task: AiTaskType,
): Promise<AiTaskResult> {
  const parsed = await getParsedResume(resumeId)

  const buildPrompt = promptBuilders[task]
  if (!buildPrompt) {
    throw new AppError(400, `Unknown AI task: ${task}`, ERROR_CODES.VALIDATION_ERROR)
  }

  const prompt = buildPrompt(parsed)
  let lastError: string | undefined

  for (let attempt = 0; attempt <= config.ollama.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        logger.info('Retrying AI task', { task, attempt })
      }

      const raw = await queryOllama(prompt)

      const cleaned = raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()

      const result = JSON.parse(cleaned) as AiTaskResult

      if (!validateTaskResult(task, result)) {
        lastError = 'AI response failed validation'
        logger.warn('AI response validation failed', { task, attempt })
        continue
      }

      logger.info('AI task completed', { task, resumeId })
      return result
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown AI error'
      logger.warn('AI task attempt failed', { task, attempt, error: lastError })
    }
  }

  throw new AppError(
    502,
    `AI analysis failed after ${config.ollama.maxRetries + 1} attempts: ${lastError || 'Unknown error'}`,
    ERROR_CODES.AI_ERROR,
  )
}

function validateTaskResult(task: AiTaskType, result: unknown): boolean {
  if (!result || typeof result !== 'object') return false

  switch (task) {
    case 'summary': {
      const r = result as AiSummaryResult
      return typeof r.summary === 'string' && Array.isArray(r.strengths) && Array.isArray(r.weaknesses) && Array.isArray(r.suggestions)
    }
    case 'grammar': {
      const r = result as AiGrammarResult
      return Array.isArray(r.issues) && typeof r.overallAssessment === 'string'
    }
    case 'bullets': {
      const r = result as AiBulletsResult
      return Array.isArray(r.improvements)
    }
    case 'projects': {
      const r = result as AiProjectsResult
      return Array.isArray(r.improvements)
    }
    case 'experience': {
      const r = result as AiExperienceResult
      return Array.isArray(r.improvements)
    }
    case 'verbs': {
      const r = result as AiActionVerbsResult
      return Array.isArray(r.suggestions)
    }
    case 'tone': {
      const r = result as AiToneResult
      return typeof r.assessment === 'string' && Array.isArray(r.suggestions)
    }
    case 'career': {
      const r = result as AiCareerResult
      return Array.isArray(r.suggestedRoles) && Array.isArray(r.skillGaps) && Array.isArray(r.recommendations)
    }
    case 'rewrite': {
      const r = result as AiRewriteResult
      return typeof r.rewrittenResume === 'string' && Array.isArray(r.changes)
    }
    default:
      return false
  }
}

export async function getAiTaskResult(
  resumeId: string,
  task: AiTaskType,
): Promise<AiTaskResult | null> {
  const resume = await resumeRepository.findResumeById(resumeId)
  if (!resume) {
    throw new AppError(404, 'Resume not found.', ERROR_CODES.NOT_FOUND)
  }

  const { aiResults } = resume as unknown as { aiResults?: string | null }
  if (!aiResults) return null

  try {
    const results = JSON.parse(aiResults) as Record<string, AiTaskResult>
    return results[task] || null
  } catch {
    return null
  }
}

export async function saveAiTaskResult(
  resumeId: string,
  task: AiTaskType,
  result: AiTaskResult,
): Promise<void> {
  const resume = await resumeRepository.findResumeById(resumeId)
  if (!resume) {
    throw new AppError(404, 'Resume not found.', ERROR_CODES.NOT_FOUND)
  }

  const existing = (resume as unknown as { aiResults?: string | null }).aiResults
  const results: Record<string, AiTaskResult> = existing ? JSON.parse(existing) : {}
  results[task] = result

  await resumeRepository.updateResumeAiResults(resumeId, JSON.stringify(results))
}
