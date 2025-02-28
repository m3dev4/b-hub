import express from 'express'
import { isAuthenticate } from '../middlewares/auth.middleware.js'
import { getRecommendedSkills } from '../services/recommendationService.js'

const router = express.Router()

router.get('/recommended', isAuthenticate, getRecommendedSkills)

export default router