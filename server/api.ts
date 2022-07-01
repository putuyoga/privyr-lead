import bodyParser from 'body-parser'
import express from 'express'
import firebase from 'firebase-admin'
import joi from 'joi'
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
app.get('/api/v1/users/:userId/leads', async (request, response) => {
  const { userId } = request?.params || {}
  const { after, limit = '4' } = request?.query || {}

  const querySchema = joi
    .object()
    .keys({
      after: joi.string().pattern(/^\d+?:\d+?$/),
      limit: joi.number().min(1),
    })
    .optional()

  const validationResult = querySchema.validate(request?.query)
  if (validationResult?.error) {
    return response.status(400).json({
      message: validationResult?.error?.message || 'Invalid query parameters',
      data: request?.query,
    })
  }

  const userSnapshot = await users.doc(userId).get()

  if (!userSnapshot.exists) {
    return response
      .status(404)
      .json({ message: `user with id '${userId}' does not exist` })
  }

  const baseQuery = users
    .doc(userId)
    .collection('leads')
    .orderBy('createdAt', 'desc')

  const timeCursor = (after as string)
    ?.split(':')
    .map((time) => Number.parseInt(time))

  const timestamp = after
    ? new firebase.firestore.Timestamp(...(timeCursor as [number, number]))
    : null
  const selectedQuery = after ? baseQuery.startAfter(timestamp) : baseQuery
  const leadSnapshot = await selectedQuery
    .limit(Number.parseInt(limit as string))
    .get()

  const leads = leadSnapshot.docs.map((doc) => doc.data())

  const result = okJson(leads)
  response.status(200).json(result)
})

/**
 * Get user's webhook id
 * The ID will be used as the unique identifier for user's webhook url
 */
app.get('/api/v1/users/:userId/webhook', async (request, response) => {
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
app.put('/api/v1/users/:userId/webhook', async (request, response) => {
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
