import express from 'express'
import admin from '../service/database.js'
import { okJson, errorJson } from '../service/response'

const router = express.Router()
const users = admin.firestore().collection('users')

/**
 * Get user's webhook id
 * The ID will be used as the unique identifier for user's webhook url
 */
router.get('/users/:userId/webhook', async (request, response) => {
  const { userId } = request?.params || {}
  try {
    const snapshot = await users.doc(userId).get()

    if (!snapshot.exists) {
      const message = `user with id '${userId}' does not exist`
      return response.status(404).json({ message })
    }
    const userData = snapshot.data()
    const result = okJson(userData?.webhookId)
    return response.status(200).json(result)
  } catch (error) {
    const message = `Unexpected error occured. Detail: ${error}`
    const result = errorJson(message)
    response.status(500).json(result)
  }
})

export default router
