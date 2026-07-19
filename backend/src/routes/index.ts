import { Router } from 'express'
import healthRouter from './health.routes.js'
import resumeRouter from './resume.routes.js'
import analysisRouter from './analysis.routes.js'

const router = Router()

router.use(healthRouter)
router.use(resumeRouter)
router.use(analysisRouter)

export default router
