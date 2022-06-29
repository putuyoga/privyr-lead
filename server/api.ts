import bodyParser from 'body-parser'
import express from 'express'
import firebase from 'firebase-admin'
import { nanoid } from 'nanoid'
import admin from './service/database.js'

const app = express()
app.use(bodyParser.json())

const users = admin.firestore().collection('users')

const okJson = (payload: any) => ({
  success: true,
  data: payload,
})

/**
 * Retrieve all user's leads
 */
app.get('/users/:userId/leads', async (request, response) => {
  const { userId } = request?.params || {}

  const userSnapshot = await users.doc(userId).get()

  if (!userSnapshot.exists) {
    return response
      .status(404)
      .json({ message: `user with id '${userId}' does not exist` })
  }

  const leadSnapshot = await users.doc(userId).collection('leads').get()
  const leads = leadSnapshot.docs.map((doc) => doc.data())

  response.status(200).json(okJson(leads))
})

app.get('/users/:userId/webhook', async (request, response) => {
  const { userId } = request?.params || {}

  const snapshot = await users.doc(userId).get()

  if (!snapshot.exists) {
    return response
      .status(400)
      .json({ message: `user with id '${userId}' does not exist` })
  }
  const userData = snapshot.data()
  const result = okJson(userData?.webhookId)
  return response.status(200).json(result)
})

/**
 * Create or regenerate user's webhook link ID,
 * Webhook ID will be unique and randomly generated to avoid guessed by unauthorized actor
 */
app.put('/users/:userId/webhook', async (request, response) => {
  const { userId } = request?.params || {}

  // It will generate secure and yet random id
  // something like "Uakgb_J5m9g-0JDMbcJqLJ"
  const webhookId = nanoid()

  // Insert or update the user instance
  const payload = {
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    webhookId,
  }
  const result = await users.doc(userId).set(payload)

  if (result.writeTime) {
    return response.status(200).json(okJson(payload))
  }

  return response
    .status(500)
    .json({ message: 'There is some error while regenerate webhook ID' })
})

module.exports = app
