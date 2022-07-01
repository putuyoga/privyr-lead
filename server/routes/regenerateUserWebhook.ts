import express from 'express'
import { nanoid } from 'nanoid'
import firebase from 'firebase-admin'
import admin from '../service/database.js'
import { okJson, errorJson } from '../service/response'

const router = express.Router()
const users = admin.firestore().collection('users')

/**
 * Create or regenerate user's webhook link ID,
 * Webhook ID will be unique and randomly generated to avoid guessed by unauthorized actor
 */
router.put('/users/:userId/webhook', async (request, response) => {
  const { userId } = request?.params || {}
  try {
    // It will generate secure and yet random id
    // something like "Uakgb_J5m9g-0JDMbcJqLJ"
    const webhookId = nanoid()

    // Insert or update the user instance
    const newData = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      webhookId,
    }
    const document = await users.doc(userId).set(newData)

    if (document.writeTime) {
      const result = okJson({ webhookId })
      return response.status(200).json(result)
    }
    const message = 'Failed to generate webhook. Please try again. '
    const result = errorJson(message)
    return response.status(500).json(result)
  } catch (error) {
    const message = `Unexpected error occured. Detail: ${error}`
    const result = errorJson(message)
    response.status(500).json(result)
  }
})

export default router
