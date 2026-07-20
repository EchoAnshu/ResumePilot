import type { Request, Response, NextFunction } from 'express'
import * as dashboardService from '../services/dashboard.service.js'
import type { ApiResponse } from '../types/index.js'
import type { DashboardData } from '../services/dashboard.service.js'

export async function getDashboard(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await dashboardService.getDashboardData()

    const response: ApiResponse<DashboardData> = {
      success: true,
      message: 'Dashboard data retrieved.',
      data,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}
