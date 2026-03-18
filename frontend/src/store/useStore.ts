import { create } from 'zustand'

import type { Currency, Debt, Lang, PlanResult, Screen, Strategy } from '../types'

interface UserData {
  nombre: string
  extraMensual: number
  moneda: Currency
  estrategia: Strategy
  deudas: Debt[]
}

interface AppState {
  screen: Screen
  lang: Lang
  userData: UserData
  resultado: PlanResult | null
  pin: string | null
  createdAt: string | null
  expiresAt: string | null
  isLoading: boolean
  error: string | null
  setScreen: (screen: Screen) => void
  setLang: (lang: Lang) => void
  setUserData: (data: Partial<UserData>) => void
  addDebt: (debt?: Debt) => void
  removeDebt: (id: string) => void
  updateDebt: (id: string, debt: Partial<Debt>) => void
  setResultado: (resultado: PlanResult, pin: string, createdAt: string, expiresAt: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const createDebt = (): Debt => ({
  id: crypto.randomUUID(),
  nombre: '',
  saldo: 0,
  tasa: 0,
  cuotaMin: 0
})

const initialUserData = (): UserData => ({
  nombre: '',
  extraMensual: 0,
  moneda: 'USD',
  estrategia: 'ai',
  deudas: [createDebt()]
})

export const useStore = create<AppState>((set) => ({
  screen: 'landing',
  lang: 'es',
  userData: initialUserData(),
  resultado: null,
  pin: null,
  createdAt: null,
  expiresAt: null,
  isLoading: false,
  error: null,
  setScreen: (screen) => set({ screen }),
  setLang: (lang) => set({ lang }),
  setUserData: (data) =>
    set((state) => ({
      userData: {
        ...state.userData,
        ...data
      }
    })),
  addDebt: (debt) =>
    set((state) => ({
      userData: {
        ...state.userData,
        deudas: [...state.userData.deudas, debt ?? createDebt()]
      }
    })),
  removeDebt: (id) =>
    set((state) => {
      const nextDebts = state.userData.deudas.filter((debt) => debt.id !== id)
      return {
        userData: {
          ...state.userData,
          deudas: nextDebts.length > 0 ? nextDebts : [createDebt()]
        }
      }
    }),
  updateDebt: (id, debt) =>
    set((state) => ({
      userData: {
        ...state.userData,
        deudas: state.userData.deudas.map((item) => (item.id === id ? { ...item, ...debt } : item))
      }
    })),
  setResultado: (resultado, pin, createdAt, expiresAt) =>
    set({
      resultado,
      pin,
      createdAt,
      expiresAt,
      isLoading: false,
      error: null
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () =>
    set({
      screen: 'landing',
      lang: 'es',
      userData: initialUserData(),
      resultado: null,
      pin: null,
      createdAt: null,
      expiresAt: null,
      isLoading: false,
      error: null
    })
}))
