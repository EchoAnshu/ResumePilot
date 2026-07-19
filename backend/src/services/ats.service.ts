import { logger } from '../config/logger.js'
import { AppError } from '../middleware/errorHandler.js'
import { ERROR_CODES, ANALYSIS_STATUS } from '../constants/index.js'
import * as resumeRepository from '../repositories/resume.repository.js'
import * as analysisRepository from '../repositories/analysis.repository.js'
import { parseResume } from '../parsers/resumeParser.js'
import { calculateAtsScore } from './ats/atsCalculator.js'
import type { AtsScore } from '../types/index.js'

export async function analyzeResume(id: string): Promise<AtsScore> {
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

  const parsed = JSON.parse(parsedData)

  logger.info('Starting ATS analysis', { id })
  const atsScore = calculateAtsScore(parsed)
  const atsJson = JSON.stringify(atsScore)

  const existing = await analysisRepository.findAnalysisByResumeId(id)
  if (existing) {
    await analysisRepository.updateAnalysis(existing.id, {
      status: ANALYSIS_STATUS.COMPLETED,
      atsScore: atsJson,
    })
  } else {
    await analysisRepository.createAnalysis({
      resumeId: id,
      status: ANALYSIS_STATUS.COMPLETED,
      atsScore: atsJson,
    })
  }

  logger.info('ATS analysis completed', { id, overall: atsScore.overall })
  return atsScore
}

export async function getAnalysis(id: string): Promise<{ atsScore: AtsScore | null }> {
  const resume = await resumeRepository.findResumeById(id)
  if (!resume) {
    throw new AppError(404, 'Resume not found.', ERROR_CODES.NOT_FOUND)
  }

  const analysis = await analysisRepository.findAnalysisByResumeId(id)
  if (!analysis || !analysis.atsScore) {
    return { atsScore: null }
  }

  return { atsScore: JSON.parse(analysis.atsScore) as AtsScore }
}
