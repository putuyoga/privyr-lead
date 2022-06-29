interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface Lead {}

interface RegenerateWebhookResult {
  created: number
  webhookId: string
}

interface GetLeadsReturn {
  error?: {
    code: number
    message: string
  }
  data?: any[]
}

const baseUrl = `http://localhost:3000/api`

export async function getLeads(userId: string): Promise<GetLeadsReturn> {
  const url = `${baseUrl}/users/${userId}/leads`
  const response = await fetch(url)

  if (response.status === 404) {
    return { error: { code: 404, message: 'lead not found' } }
  }

  const userData = (await response.json()) as ApiResponse<Lead[]>
  return { data: userData.data }
}

export async function getWebhookId(userId: string) {
  const url = `${baseUrl}/users/${userId}/webhook`
  const response = await fetch(url)
  if (response.status !== 200) return null
  const result = (await response.json()) as ApiResponse<string>
  return result?.data
}

export async function requestNewWebhookId(userId: string) {
  const url = `${baseUrl}/users/${userId}/webhook`
  const response = await fetch(url, { method: 'PUT' })
  if (response.status !== 200) return null
  const result = (await response.json()) as ApiResponse<RegenerateWebhookResult>
  return result?.data?.webhookId
}
