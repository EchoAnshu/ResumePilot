import express from 'express'
import cors from 'cors'
import { config } from './config/index.js'
import { logger } from './config/logger.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get(`${config.apiPrefix}/health`, (_req, res) => {
  res.json({ success: true, message: 'ResumePilot server is running', data: { uptime: process.uptime() } })
})

async function start(): Promise<void> {
  try {
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`)
      logger.info(`Health check: http://localhost:${config.port}${config.apiPrefix}/health`)
    })
  } catch (error) {
    logger.error('Failed to start server', { error })
    process.exit(1)
  }
}

process.on('SIGINT', () => {
  logger.info('Shutting down...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  logger.info('Shutting down...')
  process.exit(0)
})

start()
