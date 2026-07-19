import { Router } from 'express'
import { runAiTask } from '../controllers/ai.controller.js'

const router = Router()

router.post('/resume/:id/ai/:task', runAiTask)

export default router
