import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { prisma } from '../database/client.js'
import { logger } from '../config/logger.js'
import { config } from '../config/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export interface AppSettings {
  theme: string
  aiModel: string
  ollamaHost: string
  autoAnalyze: string
  storagePath: string
  logLevel: string
}

const DEFAULT_SETTINGS: Record<string, string> = {
  theme: 'light',
  aiModel: config.ollama.model,
  ollamaHost: config.ollama.host,
  autoAnalyze: 'true',
  storagePath: config.uploadDir,
  logLevel: config.logLevel,
}

export async function getAllSettings(): Promise<AppSettings> {
  const dbSettings = await prisma.setting.findMany()
  const map = new Map(dbSettings.map((s) => [s.key, s.value]))

  const merged: Record<string, string> = {}
  for (const [key, defaultValue] of Object.entries(DEFAULT_SETTINGS)) {
    merged[key] = map.get(key) ?? defaultValue
  }

  return merged as unknown as AppSettings
}

export async function updateSetting(key: string, value: string): Promise<AppSettings> {
  if (!(key in DEFAULT_SETTINGS)) {
    throw new Error(`Unknown setting: ${key}`)
  }

  await prisma.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  })

  logger.info('Setting updated', { key, value })
  return getAllSettings()
}

export async function clearCache(): Promise<{ freedBytes: number }> {
  const reportsDir = path.resolve(__dirname, '../../', '../storage/reports')
  const exportsDir = path.resolve(__dirname, '../../', '../storage/exports')
  const tempDir = path.resolve(__dirname, '../../', '../storage/temp')

  let freedBytes = 0

  for (const dir of [reportsDir, exportsDir, tempDir]) {
    try {
      const exists = await fs.stat(dir).then(() => true).catch(() => false)
      if (!exists) continue

      const entries = await fs.readdir(dir)
      for (const entry of entries) {
        if (entry === '.gitkeep') continue
        const fullPath = path.join(dir, entry)
        const stat = await fs.stat(fullPath)
        freedBytes += stat.size
        await fs.unlink(fullPath)
      }
    } catch (error) {
      logger.warn('Failed to clear directory', { dir, error })
    }
  }

  logger.info('Cache cleared', { freedBytes })
  return { freedBytes }
}
