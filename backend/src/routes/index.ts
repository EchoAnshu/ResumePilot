import { Router } from 'express'
import healthRouter from './health.routes.js'
import resumeRouter from './resume.routes.js'
import analysisRouter from './analysis.routes.js'
import atsRouter from './ats.routes.js'
import aiRouter from './ai.routes.js'
import jdRouter from './jd.routes.js'
import dashboardRouter from './dashboard.routes.js'
import exportRouter from './export.routes.js'
import settingsRouter from './settings.routes.js'

const router = Router()

router.use(healthRouter)
router.use(resumeRouter)
router.use(analysisRouter)
router.use(atsRouter)
router.use(aiRouter)
router.use(jdRouter)
router.use(dashboardRouter)
router.use(exportRouter)
router.use(settingsRouter)

export default router
