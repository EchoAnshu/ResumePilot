import { logger } from '../config/logger.js'
import { AppError } from '../middleware/errorHandler.js'
import { ERROR_CODES } from '../constants/index.js'
import { extractTextFromPdf } from './pdfParser.js'
import { extractTextFromDocx } from './docxParser.js'
import { parseResumeText } from './textParser.js'
import type { ParsedResume } from '../types/index.js'

export async function parseResume(
  filename: string,
  mimeType: string,
): Promise<ParsedResume> {
  logger.info('Starting resume parse', { filename, mimeType })

  let rawText: string

  switch (mimeType) {
    case 'application/pdf':
      rawText = await extractTextFromPdf(filename)
      break
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      rawText = await extractTextFromDocx(filename)
      break
    default:
      throw new AppError(400, 'Unsupported file type for parsing.', ERROR_CODES.INVALID_FILE_TYPE)
  }

  if (!rawText || rawText.trim().length === 0) {
    throw new AppError(422, 'No extractable text found in the resume.', ERROR_CODES.PARSER_ERROR)
  }

  const parsed = parseResumeText(rawText)

  logger.info('Resume parsed successfully', {
    filename,
    name: parsed.name,
    skillsCount: parsed.skills.length,
    experienceCount: parsed.experience.length,
  })

  return parsed
}
