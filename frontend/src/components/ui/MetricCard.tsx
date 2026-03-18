import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'
import { formatCurrency } from '../../lib/calculations'
import { useI18n } from '../../lib/i18n'
import type { Currency } from '../../types'

interface MetricCardProps {
  label: string
  value: number
  currency?: Currency
  format?: 'currency' | 'number'
}

export function MetricCard({ label, value, currency, format = 'number' }: MetricCardProps) {
  const counter = useAnimatedCounter(value)
  const { lang } = useI18n()
  const display =
    format === 'currency' && currency ? formatCurrency(counter, currency, lang) : `${counter}`

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="font-mono text-2xl text-text">{display}</p>
      <p className="mt-2 text-sm text-snow">{label}</p>
    </div>
  )
}
