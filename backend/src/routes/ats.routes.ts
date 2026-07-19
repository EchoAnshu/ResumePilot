import { Router } from 'express'
import { getAtsAnalysis, triggerAtsAnalysis } from '../controllers/ats.controller.js'

const router = Router()

router.get('/resume/:id/analysis', getAtsAnalysis)
router.post('/resume/:id/analyze', triggerAtsAnalysis)

export default router
