import { logger } from '../config/logger.js'
import { AppError } from '../middleware/errorHandler.js'
import { ERROR_CODES } from '../constants/index.js'
import * as resumeRepository from '../repositories/resume.repository.js'
import * as jdRepository from '../repositories/jd.repository.js'
import { parseResume } from '../parsers/resumeParser.js'
import { matchResumeWithJd } from './jd/jdMatcher.js'
import type { ParsedResume, JdMatchResult } from '../types/index.js'

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

export async function matchWithJd(
  resumeId: string,
  jdText: string,
): Promise<JdMatchResult> {
  if (!jdText || jdText.trim().length < 10) {
    throw new AppError(400, 'Job description must be at least 10 characters.', ERROR_CODES.VALIDATION_ERROR)
  }

  const parsed = await getParsedResume(resumeId)

  logger.info('Starting JD match', { resumeId, jdLength: jdText.length })
  const result = matchResumeWithJd(parsed, jdText)

  await jdRepository.createJdMatch({
    resumeId,
    jdText,
    matchData: JSON.stringify(result),
  })

  logger.info('JD match completed', { resumeId, matchPercentage: result.matchPercentage })
  return result
}

export async function getLatestMatch(resumeId: string): Promise<JdMatchResult | null> {
  const existing = await jdRepository.findLatestJdMatch(resumeId)
  if (!existing) return null

  return JSON.parse(existing.matchData) as JdMatchResult
}
