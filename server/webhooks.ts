import joi from 'joi'
import bodyParser from 'body-parser'
import express from 'express'
import firebase from 'firebase-admin'
import admin from './service/database.js'
import { errorJson } from './service/response'

const app = express()

/**
 * TODO:
 * We can add another middleware here,
 * to validate secret key being passed into the authorization header
 */
app.use((req, res, next) => {
  // JSON parsing validation
  bodyParser.json()(req, res, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      return res.status(400).json({ message: 'Invalid JSON payload' })
    }

    next()
  })
})

// Field validation schema
const schema = joi.object().keys({
  name: joi.string().min(2).required(),
  email: joi.string().email().required(),
  phone: joi
    .string()
    .pattern(/^\+?\d+$/)
    .required(),
  other: joi.object().optional().min(1),
})

const users = admin.firestore().collection('users')

app.post('/:webhookId', async (request, response) => {
  const { body, params } = request

  try {
    // Checking if the webhook belong to certain user
    const userDoc = await getUserByWebhookId(params.webhookId)
    if (!userDoc) {
      const message = 'Webhook does not exist'
      return response.status(404).json({ message })
    }

    // Validate the payload fields based on the defined schema
    const validationResult = schema.validate(body)
    if (validationResult?.error) {
      return response.status(400).json({
        message: validationResult?.error?.message || 'Invalid request',
        data: body,
      })
    }

    // Checking any phone or email duplication
    const { hasDuplication, message } = await checkDuplication(userDoc.id, body)
    if (hasDuplication) {
      const result = errorJson(message)
      return response.status(409).json(result)
    }

    // Insert the lead information to the database
    await insertLead({ webhookId: params.webhookId, body, userId: userDoc.id })
    response.status(200).json({ success: true, data: body })
  } catch (error) {
    const message = `Unexpected error occured. Detail: ${error}`
    response.status(500).json({ success: false, message })
  }

  // TODO: Should add webhook event log
})

interface InsertLeadParams {
  webhookId: string
  userId: string
  body: any
}

const insertLead = async (params: InsertLeadParams) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp()
  const payload = {
    ...params.body,
    createdAt: timestamp,
    webhookId: params.webhookId,
  }
  await users.doc(params.userId).collection('leads').add(payload)
}

interface CheckDuplicationParams {
  email: string
  phone: string
}

const checkDuplication = async (
  userId: string,
  params: CheckDuplicationParams
) => {
  const leads = users.doc(userId).collection('leads')

  const existingLeadEmail = await leads.where('email', '==', params.email).get()
  if (existingLeadEmail.docs.length) {
    return { hasDuplication: true, message: 'Email is already exist. ' }
  }

  const existingLeadPhone = await leads.where('phone', '==', params.phone).get()
  if (existingLeadPhone.docs.length) {
    return { hasDuplication: true, message: 'Phone is already exist. ' }
  }

  return { hasDuplication: false, message: '' }
}

const getUserByWebhookId = async (webhookId: string) => {
  const userSnapshot = await users.where('webhookId', '==', webhookId).get()
  return userSnapshot.docs[0]
}

module.exports = app
