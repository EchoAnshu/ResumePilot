import { Router } from 'express'
import { upload } from '../middleware/fileUpload.js'
import {
  uploadResume,
  listResumes,
  getResume,
  deleteResume,
  replaceResume,
} from '../controllers/resume.controller.js'

const router = Router()

router.post('/resume/upload', upload.single('resume'), uploadResume)
router.get('/resumes', listResumes)
router.get('/resume/:id', getResume)
router.delete('/resume/:id', deleteResume)
router.put('/resume/:id/replace', upload.single('resume'), replaceResume)

export default router
