import { Router } from 'express'
import { getParsedResume, reparseResume } from '../controllers/analysis.controller.js'

const router = Router()

router.get('/resume/:id/parsed', getParsedResume)
router.post('/resume/:id/reparse', reparseResume)

export default router
