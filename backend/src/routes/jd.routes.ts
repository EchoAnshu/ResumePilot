import { Router } from 'express'
import { matchJd, getMatchResult } from '../controllers/jd.controller.js'

const router = Router()

router.post('/resume/:id/jd/match', matchJd)
router.get('/resume/:id/jd/match', getMatchResult)

export default router
