import joi from 'joi'
import bodyParser from 'body-parser'
import express from 'express'
import firebase from 'firebase-admin'
import admin from './service/database.js'

const app = express()
app.use(bodyParser.json())

const schema = joi.object().keys({
  name: joi.string().min(2).required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
})

const users = admin.firestore().collection('users')

app.post('/:webhookId', async (request, response) => {
  const { body, params } = request

  const userSnapshot = await users
    .where('webhookId', '==', params.webhookId)
    .get()

  const userDoc = userSnapshot.docs[0]

  // There is no such webhook id, we treat it as unknown path
  if (!userDoc.exists) return response.status(404)

  const validationResult = schema.validate(body)

  if (validationResult?.error) {
    return response.status(422).json({
      message: validationResult?.error?.message || 'Invalid request',
      data: body,
    })
  }

  const payload = {
    ...body,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    webhookId: params.webhookId,
  }
  users.doc(userDoc.id).collection('leads').add(payload)

  response.status(200).json({ body })
})

module.exports = app
