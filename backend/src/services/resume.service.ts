import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from '../config/index.js'
import { logger } from '../config/logger.js'
import { AppError } from '../middleware/errorHandler.js'
import { ERROR_CODES } from '../constants/index.js'
import {
  validateFileType,
  validateFileSize,
  validateFileExtension,
} from '../validators/resume.validator.js'
import * as resumeRepository from '../repositories/resume.repository.js'
import { parseResume } from '../parsers/resumeParser.js'
import type { Resume } from '@prisma/client'
import type { ParsedResume } from '../types/index.js'
import { ensurePathWithin } from '../security/validate.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.resolve(__dirname, '../../', config.uploadDir)

export interface UploadResult {
  resume: Resume
}

export interface ReplaceResult {
  resume: Resume
  previousFilename: string
}

export async function uploadResume(file: Express.Multer.File): Promise<UploadResult> {
  validateFileType(file.mimetype)
  validateFileSize(file.size)
  validateFileExtension(file.originalname)

  const resume = await resumeRepository.createResume({
    originalName: file.originalname,
    filename: file.filename,
    mimeType: file.mimetype,
    size: file.size,
  })

  try {
    const parsed = await parseResume(resume.filename, resume.mimeType)
    await resumeRepository.updateResumeParsedData(resume.id, JSON.stringify(parsed))
    logger.info('Resume parsed after upload', { id: resume.id })
  } catch (error) {
    logger.warn('Resume parsing failed after upload', { id: resume.id, error })
  }

  logger.info('Resume uploaded', {
    id: resume.id,
    originalName: resume.originalName,
    size: resume.size,
  })

  return { resume }
}

export async function listResumes(): Promise<Resume[]> {
  return resumeRepository.findAllResumes()
}

export async function getResume(id: string): Promise<Resume> {
  const resume = await resumeRepository.findResumeById(id)
  if (!resume) {
    throw new AppError(404, 'Resume not found.', ERROR_CODES.NOT_FOUND)
  }
  return resume
}

export async function deleteResume(id: string): Promise<void> {
  const resume = await getResume(id)

  const filePath = ensurePathWithin(uploadDir, resume.filename)
  await fs.unlink(filePath).catch(() => {
    logger.warn('File not found on disk during delete', { filename: resume.filename })
  })

  await resumeRepository.deleteResumeById(id)

  logger.info('Resume deleted', { id, originalName: resume.originalName })
}

export async function replaceResume(
  id: string,
  file: Express.Multer.File,
): Promise<ReplaceResult> {
  validateFileType(file.mimetype)
  validateFileSize(file.size)
  validateFileExtension(file.originalname)

  const existing = await getResume(id)

  const oldFilePath = ensurePathWithin(uploadDir, existing.filename)
  await fs.unlink(oldFilePath).catch(() => {
    logger.warn('Previous file not found on disk during replace', { filename: existing.filename })
  })

  const updated = await resumeRepository.updateResumeFile(id, {
    originalName: file.originalname,
    filename: file.filename,
    mimeType: file.mimetype,
    size: file.size,
  })

  try {
    const parsed = await parseResume(updated.filename, updated.mimeType)
    await resumeRepository.updateResumeParsedData(updated.id, JSON.stringify(parsed))
    logger.info('Resume re-parsed after replace', { id: updated.id })
  } catch (error) {
    logger.warn('Resume parsing failed after replace', { id: updated.id, error })
  }

  logger.info('Resume replaced', {
    id: updated.id,
    previousName: existing.originalName,
    newName: updated.originalName,
  })

  return { resume: updated, previousFilename: existing.filename }
}

export async function getParsedResume(id: string): Promise<ParsedResume> {
  const resume = await getResume(id)

  if (!resume.parsedData) {
    const parsed = await parseResume(resume.filename, resume.mimeType)
    const json = JSON.stringify(parsed)
    await resumeRepository.updateResumeParsedData(resume.id, json)
    return parsed
  }

  return JSON.parse(resume.parsedData) as ParsedResume
}

export async function triggerReparse(id: string): Promise<ParsedResume> {
  const resume = await getResume(id)
  const parsed = await parseResume(resume.filename, resume.mimeType)
  const json = JSON.stringify(parsed)
  await resumeRepository.updateResumeParsedData(resume.id, json)
  logger.info('Resume re-parsed on demand', { id })
  return parsed
}
