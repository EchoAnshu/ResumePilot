import type { Request, Response, NextFunction } from 'express'
import * as settingsService from '../services/settings.service.js'
import type { ApiResponse } from '../types/index.js'
import type { AppSettings } from '../services/settings.service.js'
import { sanitizeText } from '../security/validate.js'

const ALLOWED_KEYS = new Set([
  'theme', 'aiModel', 'ollamaHost', 'autoAnalyze', 'storagePath', 'logLevel',
])

export async function getSettings(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const settings = await settingsService.getAllSettings()

    const response: ApiResponse<AppSettings> = {
      success: true,
      message: 'Settings retrieved.',
      data: settings,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export async function updateSettings(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { key, value } = req.body

    if (!key || value === undefined) {
      const response: ApiResponse = {
        success: false,
        message: 'Both key and value are required.',
        error: { code: 'VALIDATION_ERROR' },
      }
      res.status(400).json(response)
      return
    }

    if (!ALLOWED_KEYS.has(key)) {
      const response: ApiResponse = {
        success: false,
        message: `Unknown setting key "${key}". Allowed keys: ${[...ALLOWED_KEYS].join(', ')}`,
        error: { code: 'VALIDATION_ERROR' },
      }
      res.status(400).json(response)
      return
    }

    const safeValue = sanitizeText(String(value)).slice(0, 500)
    const settings = await settingsService.updateSetting(key, safeValue)

    const response: ApiResponse<AppSettings> = {
      success: true,
      message: 'Setting updated.',
      data: settings,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export async function clearCache(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await settingsService.clearCache()

    const response: ApiResponse<{ freedBytes: number }> = {
      success: true,
      message: 'Cache cleared successfully.',
      data: result,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}
