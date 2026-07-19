import { Router } from 'express'
import healthRouter from './health.routes.js'
import resumeRouter from './resume.routes.js'

const router = Router()

router.use(healthRouter)
router.use(resumeRouter)

export default router
