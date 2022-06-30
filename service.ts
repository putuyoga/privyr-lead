interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Lead {
  name: string
  email: string
  phone: string
  other?: object

  // Extra information for log purpose and easier tracking
  webhookId: string
  createdAt: { _seconds: number; _nanoseconds: number }
}

interface RegenerateWebhookResult {
  created: number
  webhookId: string
}

interface GetLeadsReturn {
  error?: {
    code: number
    message: string
  }
  data?: Lead[]
}

// TODO: Use environment variables
export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? `https://privyr-lead.vercel.app`
    : `http://localhost:3000`

const baseApiUrl = `${baseUrl}/api/v1`

export async function getLeads(
  userId: string,
  after?: Lead['createdAt']
): Promise<GetLeadsReturn> {
  const query = after ? `?after=${after._seconds}:${after._nanoseconds}` : ''
  const url = `${baseApiUrl}/users/${userId}/leads${query}`
  const response = await fetch(url)

  if (response.status === 404) {
    return { error: { code: 404, message: 'lead not found' } }
  }

  const userData = (await response.json()) as ApiResponse<Lead[]>
  return { data: userData.data }
}

export async function getWebhookId(userId: string) {
  const url = `${baseApiUrl}/users/${userId}/webhook`
  const response = await fetch(url)
  if (response.status !== 200) return null
  const result = (await response.json()) as ApiResponse<string>
  return result?.data
}

export async function requestNewWebhookId(userId: string) {
  const url = `${baseApiUrl}/users/${userId}/webhook`
  const response = await fetch(url, { method: 'PUT' })
  if (response.status !== 200) return null
  const result = (await response.json()) as ApiResponse<RegenerateWebhookResult>
  return result?.data?.webhookId
}
