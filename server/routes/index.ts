import express from 'express'
import getUserLeads from './getUserLeads'
import getUserWebhook from './getUserWebhook'
import regenerateUserWebhook from './regenerateUserWebhook'

const router = express.Router()
router.use('/', getUserLeads)
router.use('/', getUserWebhook)
router.use('/', regenerateUserWebhook)

export default router
