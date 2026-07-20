import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config/index.js'
import { logger } from './config/logger.js'
import routes from './routes/index.js'
import { connectDatabase, disconnectDatabase } from './database/client.js'

const app = express()

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(config.apiPrefix, routes)

async function start(): Promise<void> {
  try {
    await connectDatabase()

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`)
    })
  } catch (error) {
    logger.error('Failed to start server', { error })
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  logger.info('Shutting down...')
  await disconnectDatabase()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('Shutting down...')
  await disconnectDatabase()
  process.exit(0)
})

start()
