import { Router } from 'express'
import { getSettings, updateSettings, clearCache } from '../controllers/settings.controller.js'

const router = Router()

router.get('/settings', getSettings)
router.put('/settings', updateSettings)
router.post('/settings/clear-cache', clearCache)

export default router
