import express from 'express'
import { errorJson } from '../service/response'
import useJsonParser from '../middleware/jsonParser'
import { checkDuplication, getUserByWebhookId, insertLead } from './utils'
import { fieldSchema } from './schema'

/**
 * TODO:
 * We can add another middleware here,
 * to validate secret key being passed into the authorization header
 */
const app = express()
useJsonParser(app)

app.post('/webhooks/:webhookId', async (request, response) => {
  const { body, params } = request

  try {
    // Checking if the webhook belong to certain user
    const userDoc = await getUserByWebhookId(params.webhookId)
    if (!userDoc) {
      const message = 'Webhook does not exist'
      return response.status(404).json({ message })
    }

    // Validate the payload fields based on the defined schema
    const validationResult = fieldSchema.validate(body)
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

  // TODO: Should add webhook event log, wether it is success / not
  // Can include IP address, date, time elapsed, and so on
})

module.exports = app
