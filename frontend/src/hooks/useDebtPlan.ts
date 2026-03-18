import { useMutation } from '@tanstack/react-query'

import { generatePlan, recoverPlan } from '../lib/api'
import { useStore } from '../store/useStore'
import type { GeneratePlanPayload } from '../types'

function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'unknown_error'
}

export function useDebtPlan() {
  const setResultado = useStore((state) => state.setResultado)
  const setError = useStore((state) => state.setError)
  const setLoading = useStore((state) => state.setLoading)
  const setScreen = useStore((state) => state.setScreen)

  const generateMutation = useMutation({
    mutationFn: async (payload: GeneratePlanPayload) => {
      setLoading(true)
      setError(null)
      return generatePlan(payload)
    },
    onSuccess: (response) => {
      setResultado(response.plan, response.pin, response.created_at, response.expires_at)
      setScreen('result')
    },
    onError: (error) => {
      setError(normalizeError(error))
      setScreen('step3')
    }
  })

  const recoverMutation = useMutation({
    mutationFn: async (pin: string) => {
      setLoading(true)
      setError(null)
      return recoverPlan(pin)
    },
    onSuccess: (response) => {
      setResultado(response.plan, response.pin, response.created_at, response.expires_at)
      setScreen('result')
    },
    onError: (error) => {
      setError(normalizeError(error))
      setLoading(false)
    }
  })

  return {
    generatePlan: generateMutation.mutateAsync,
    recoverPlan: recoverMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    isRecovering: recoverMutation.isPending
  }
}
