import express from 'express'
import firebase from 'firebase-admin'
import joi from 'joi'
import admin from '../service/database.js'
import { okJson } from '../service/response'

const router = express.Router()
const users = admin.firestore().collection('users')

/**
 * Get all of the user's leads
 * Including the query pagination to load more lead data
 */
router.get('/users/:userId/leads', async (request, response) => {
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
    .map((time) => Number.parseInt(time)) as [number, number]

  const timestamp = after
    ? new firebase.firestore.Timestamp(...timeCursor)
    : null
  const selectedQuery = after ? baseQuery.startAfter(timestamp) : baseQuery
  const leadSnapshot = await selectedQuery
    .limit(Number.parseInt(limit as string))
    .get()

  const leads = leadSnapshot.docs.map((doc) => doc.data())

  const result = okJson(leads)
  response.status(200).json(result)
})

export default router
