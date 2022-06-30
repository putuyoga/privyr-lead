import bodyParser from 'body-parser'
import express from 'express'
import firebase from 'firebase-admin'
import { nanoid } from 'nanoid'
import admin from './service/database.js'
import { errorJson, okJson } from './service/response'

const app = express()
app.use(bodyParser.json())

const users = admin.firestore().collection('users')

/**
 * Get all of the user's leads
 * Including the query pagination to load more lead data
 */
app.get('/users/:userId/leads', async (request, response) => {
  const { userId } = request?.params || {}

  const userSnapshot = await users.doc(userId).get()

  if (!userSnapshot.exists) {
    return response
      .status(404)
      .json({ message: `user with id '${userId}' does not exist` })
  }

  const leadSnapshot = await users
    .doc(userId)
    .collection('leads')
    .orderBy('createdAt', 'desc')
    .get()
  const leads = leadSnapshot.docs.map((doc) => doc.data())

  const result = okJson(leads)
  response.status(200).json(result)
})

/**
 * Get user's webhook id
 * The ID will be used as the unique identifier for user's webhook url
 */
app.get('/users/:userId/webhook', async (request, response) => {
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

/**
 * Create or regenerate user's webhook link ID,
 * Webhook ID will be unique and randomly generated to avoid guessed by unauthorized actor
 */
app.put('/users/:userId/webhook', async (request, response) => {
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

module.exports = app
