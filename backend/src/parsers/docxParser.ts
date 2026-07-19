import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger } from '../config/logger.js'
import { AppError } from '../middleware/errorHandler.js'
import { ERROR_CODES } from '../constants/index.js'
import { ensurePathWithin } from '../security/validate.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.resolve(__dirname, '../../', '../storage/resumes')

export async function extractTextFromDocx(filename: string): Promise<string> {
  const filePath = ensurePathWithin(uploadDir, filename)

  let buffer: Buffer
  try {
    buffer = await fs.readFile(filePath)
  } catch {
    throw new AppError(404, 'Resume file not found on disk.', ERROR_CODES.FILE_NOT_FOUND)
  }

  if (buffer.length === 0) {
    throw new AppError(422, 'DOCX file is empty.', ERROR_CODES.PARSER_ERROR)
  }

  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value || ''
  } catch (error) {
    logger.error('DOCX parsing failed', { filename, error })
    throw new AppError(422, 'Failed to parse DOCX file.', ERROR_CODES.PARSER_ERROR)
  }
}
