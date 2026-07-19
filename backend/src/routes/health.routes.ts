import { Router } from 'express'
import type { Request, Response } from 'express'
import type { ApiResponse, HealthData } from '../types/index.js'

const router = Router()

router.get('/health', (_req: Request, res: Response) => {
  const data: HealthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }

  const response: ApiResponse<HealthData> = {
    success: true,
    message: 'Server is running',
    data,
  }

  res.json(response)
})

export default router
