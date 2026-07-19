import multer from 'multer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../config/index.js'
import { AppError } from './errorHandler.js'
import { ERROR_CODES } from '../constants/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadPath = path.resolve(__dirname, '../../', config.uploadDir)

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  },
})

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  const allowed: readonly string[] = config.allowedMimeTypes
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new AppError(400, 'Invalid file type. Only PDF and DOCX are allowed.', ERROR_CODES.INVALID_FILE_TYPE))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
  },
})
