import express from 'express'
import { isAuthenticate } from '../middlewares/auth.middleware.js'
import { createNotification, getUnreadNotifications, markNotificationsAsRead } from '../services/notifyService.js'

const router = express.Router()


router.post('/', isAuthenticate, createNotification)
router.get('/unread', isAuthenticate, getUnreadNotifications)
router.put('/read/:id', isAuthenticate, markNotificationsAsRead)

export default router