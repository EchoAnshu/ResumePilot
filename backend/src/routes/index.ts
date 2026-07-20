import { Router } from 'express'
import healthRouter from './health.routes.js'
import resumeRouter from './resume.routes.js'
import analysisRouter from './analysis.routes.js'
import atsRouter from './ats.routes.js'
import aiRouter from './ai.routes.js'
import jdRouter from './jd.routes.js'

const router = Router()

router.use(healthRouter)
router.use(resumeRouter)
router.use(analysisRouter)
router.use(atsRouter)
router.use(aiRouter)
router.use(jdRouter)

export default router
