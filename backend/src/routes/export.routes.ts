import { Router } from 'express'
import { exportReport } from '../controllers/export.controller.js'

const router = Router()

router.get('/resume/:id/export', exportReport)

export default router
