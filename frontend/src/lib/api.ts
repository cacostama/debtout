import axios, { AxiosError } from 'axios'

import type { GeneratePlanPayload, PlanResponse } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

type ApiErrorResponse = {
  detail?: string
}

function mapApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    const detail = axiosError.response?.data?.detail
    if (detail) {
      return new Error(detail)
    }

    if (axiosError.code === 'ECONNABORTED') {
      return new Error('request_timeout')
    }

    if (!axiosError.response) {
      return new Error('network_error')
    }
  }

  return new Error('unknown_error')
}

export async function generatePlan(payload: GeneratePlanPayload): Promise<PlanResponse> {
  try {
    const { data } = await api.post<PlanResponse>('/plan/generate', payload)
    return data
  } catch (error) {
    throw mapApiError(error)
  }
}

export async function recoverPlan(pin: string): Promise<PlanResponse> {
  try {
    const { data } = await api.get<PlanResponse>(`/plan/${pin}`)
    return data
  } catch (error) {
    throw mapApiError(error)
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    await api.get('/health')
    return true
  } catch {
    return false
  }
}
