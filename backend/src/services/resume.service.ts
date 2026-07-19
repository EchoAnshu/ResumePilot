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
import type { Resume } from '@prisma/client'
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

  logger.info('Resume replaced', {
    id: updated.id,
    previousName: existing.originalName,
    newName: updated.originalName,
  })

  return { resume: updated, previousFilename: existing.filename }
}
