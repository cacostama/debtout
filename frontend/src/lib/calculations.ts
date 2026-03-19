import type { Currency, Debt, Lang, PlanResult } from '../types'

export function getDebtTotals(deudas: Debt[]) {
  return deudas.reduce(
    (acc, debt) => {
      acc.totalBalance += debt.saldo || 0
      acc.totalMinimum += debt.cuotaMin || 0
      return acc
    },
    { totalBalance: 0, totalMinimum: 0 }
  )
}

export function formatCurrency(value: number, currency: Currency, lang: Lang): string {
  const locale = lang === 'en' ? 'en-US' : 'es-AR'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0)
}

export function formatPercent(value: number, lang: Lang): string {
  const locale = lang === 'en' ? 'en-US' : 'es-AR'
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0
  }).format(value)
}

function getThousandsSeparator(currency: Currency): string {
  if (currency === 'PYG' || currency === 'ARS') {
    return '.'
  }

  return ','
}

export function formatDebtInput(value: number | string, currency: Currency): string {
  const digits = String(value).replace(/\D/g, '')
  if (!digits) {
    return ''
  }

  const separator = getThousandsSeparator(currency)
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

export function parseDebtInput(value: string): number {
  const digits = value.replace(/\D/g, '')
  return digits ? Number(digits) : 0
}

export function formatPin(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 6)
  if (digits.length <= 3) {
    return digits
  }
  return `${digits.slice(0, 3)}-${digits.slice(3)}`
}

export function buildPlanClipboardText(
  result: PlanResult,
  currency: Currency,
  lang: Lang,
  nombre: string
): string {
  const intro = lang === 'en' ? 'DebtOut Plan' : 'Plan DebtOut'
  const owner = nombre ? `${lang === 'en' ? 'Name' : 'Nombre'}: ${nombre}` : ''
  const orders = result.orden_pago
    .map(
      (item) =>
        `${item.orden}. ${item.nombre} | ${formatCurrency(item.saldo, currency, lang)} | ${formatCurrency(item.pago_mensual, currency, lang)} | ${item.mes_liquidacion}`
    )
    .join('\n')

  return [intro, owner, result.estrategia_usada, result.razon_estrategia, orders, result.consejo_financiero]
    .filter(Boolean)
    .join('\n\n')
}
