import firebase from 'firebase-admin'
import admin from '../service/database.js'

const users = admin.firestore().collection('users')

/**
 * Add a new lead data into the database
 */
export const insertLead = async (params: {
  webhookId: string
  userId: string
  body: any
}) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp()
  const payload = {
    ...params.body,
    createdAt: timestamp,
    webhookId: params.webhookId,
  }
  await users.doc(params.userId).collection('leads').add(payload)
}

/**
 * To check any duplication of email or phone
 */
export const checkDuplication = async (
  userId: string,
  params: {
    email: string
    phone: string
  }
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

/**
 * Get the user owner of the specific webhook ID
 */
export const getUserByWebhookId = async (webhookId: string) => {
  const userSnapshot = await users.where('webhookId', '==', webhookId).get()
  return userSnapshot.docs[0]
}
