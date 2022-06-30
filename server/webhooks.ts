import joi from 'joi'
import bodyParser from 'body-parser'
import express from 'express'
import firebase from 'firebase-admin'
import admin from './service/database.js'
import { errorJson } from './service/response'

const app = express()
app.use(bodyParser.json())

const schema = joi.object().keys({
  name: joi.string().min(2).required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
  other: joi.object().optional(),
})

const users = admin.firestore().collection('users')

app.post('/:webhookId', async (request, response) => {
  const { body, params } = request

  const userSnapshot = await users
    .where('webhookId', '==', params.webhookId)
    .get()

  const userDoc = userSnapshot.docs[0]

  // If the webhook id doesn't belong to any user
  if (!userDoc.exists) return response.status(404)

  // Validate the payload fields based on the defined schema
  const validationResult = schema.validate(body)
  if (validationResult?.error) {
    return response.status(400).json({
      message: validationResult?.error?.message || 'Invalid request',
      data: body,
    })
  }

  // Check any duplicate email or phone number
  // Because this our main source reference for a lead
  const leads = users.doc(userDoc.id).collection('leads')

  const existingLeadEmail = await leads.where('email', '==', body.email).get()
  if (existingLeadEmail.docs.length) {
    const message = errorJson('Email is already exist. ')
    return response.status(409).json(message)
  }

  const existingLeadPhone = await leads.where('phone', '==', body.phone).get()
  if (existingLeadPhone.docs.length) {
    const message = errorJson('Phone is already exist. ')
    return response.status(409).json(message)
  }

  // Add the lead information to the database
  try {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp()
    const payload = {
      ...body,
      createdAt: timestamp,
      webhookId: params.webhookId,
    }
    await users.doc(userDoc.id).collection('leads').add(payload)

    response.status(200).json({ body })
  } catch (error) {
    const message = `Unexpected error occured. Detail: ${error}`
    response.status(500).json({ success: false, message })
  }

  // TODO: Should add webhook event log
})

module.exports = app
