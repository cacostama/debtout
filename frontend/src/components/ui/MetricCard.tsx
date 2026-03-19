import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'
import { formatCurrency } from '../../lib/calculations'
import { useI18n } from '../../lib/i18n'
import type { Currency } from '../../types'

interface MetricCardProps {
  label: string
  value: number
  currency?: Currency
  format?: 'currency' | 'number' | 'months'
  tooltip?: string
}

export function MetricCard({ label, value, currency, format = 'number', tooltip }: MetricCardProps) {
  const counter = useAnimatedCounter(value)
  const { lang, t } = useI18n()
  const [showTooltip, setShowTooltip] = useState(false)

  const display = (() => {
    if (format === 'currency' && currency) return formatCurrency(counter, currency, lang)
    if (format === 'months') return t('result.months', { count: counter })
    return `${counter}`
  })()

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="font-mono text-2xl text-text">{display}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <p className="text-sm text-snow">{label}</p>
        {tooltip ? (
          <div className="relative">
            <button
              type="button"
              className="flex items-center justify-center text-muted transition hover:text-snow focus:outline-none"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip((v) => !v)}
              aria-label="More info"
            >
              <span className="font-mono text-xs leading-none">ⓘ</span>
            </button>
            <AnimatePresence>
              {showTooltip ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-xl border border-accent/20 bg-surface2 px-3 py-2.5 shadow-lg"
                >
                  <p className="font-mono text-xs leading-relaxed text-snow">{tooltip}</p>
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-surface2" />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </div>
  )
}
