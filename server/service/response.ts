/**
 * Utility functions,
 * to generate uniform response across API endpoints
 */

export const okJson = (payload: any) => ({
  success: true,
  data: payload,
})

export const errorJson = (message: string) => ({
  success: false,
  message,
})
