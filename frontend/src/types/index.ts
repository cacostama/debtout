export type Screen = 'landing' | 'recover' | 'step1' | 'step2' | 'step3' | 'loading' | 'result'
export type Strategy = 'snowball' | 'avalanche' | 'consolidation' | 'ai'
export type Currency = 'USD' | 'EUR' | 'GBP' | 'PYG' | 'ARS' | 'BRL' | 'COP' | 'MXN'
export type Lang = 'es' | 'en'

export interface Debt {
  id: string
  nombre: string
  saldo: number
  tasa: number
  cuotaMin: number
}

export interface PaymentOrder {
  orden: number
  nombre: string
  saldo: number
  pago_mensual: number
  mes_liquidacion: string
  porcentaje_del_total: number
}

export interface PlanResult {
  score: number
  estrategia_usada: string
  razon_estrategia: string
  meses_total: number
  fecha_libertad: string
  intereses_ahorrados: number
  orden_pago: PaymentOrder[]
  aplica_consolidacion: boolean
  consejo_consolidacion: string
  consejo_latam: string
  mensaje_motivacional: string
  advertencia: string
}

export interface PlanResponse {
  pin: string
  plan: PlanResult
  created_at: string
  expires_at: string
}

export interface GeneratePlanPayload {
  nombre: string
  extra_mensual: number
  moneda: Currency
  estrategia: Strategy
  lang: Lang
  deudas: Array<{
    nombre: string
    saldo: number
    tasa: number
    cuota_min: number
  }>
}
