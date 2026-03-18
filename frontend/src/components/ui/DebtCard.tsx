import { motion } from 'framer-motion'

import { useI18n } from '../../lib/i18n'
import type { Currency, Debt } from '../../types'

interface DebtCardProps {
  debt: Debt
  index: number
  currency: Currency
  canRemove: boolean
  errors: Partial<Record<'nombre' | 'saldo' | 'tasa' | 'cuotaMin', string>>
  onChange: (id: string, field: keyof Debt, value: string | number) => void
  onRemove: (id: string) => void
}

export function DebtCard({ debt, index, currency, canRemove, errors, onChange, onRemove }: DebtCardProps) {
  const { t } = useI18n()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="rounded-2xl border border-border bg-surface p-5 backdrop-blur-sm"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            {t('debt.cardTitle', { index: index + 1 })}
          </p>
          <h3 className="mt-1 font-syne text-lg font-bold text-text">{debt.nombre || '—'}</h3>
        </div>
        {canRemove ? (
          <button
            type="button"
            onClick={() => onRemove(debt.id)}
            className="rounded-full border border-border px-3 py-1 font-syne text-sm text-snow transition hover:border-danger/50 hover:text-text"
          >
            {t('debt.remove')}
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-snow">{t('debt.nameLabel')}</span>
          <input
            value={debt.nombre}
            onChange={(event) => onChange(debt.id, 'nombre', event.target.value)}
            placeholder={t('debt.namePlaceholder')}
            className="w-full rounded-lg border border-border bg-surface2 px-4 py-3 font-syne text-text placeholder:text-muted transition focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
          />
          {errors.nombre ? <span className="mt-2 block text-sm text-danger">{errors.nombre}</span> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-snow">
            {t('debt.balanceLabel')} <span className="font-mono text-muted">{currency}</span>
          </span>
          <input
            type="number"
            min="0"
            value={debt.saldo || ''}
            onChange={(event) => onChange(debt.id, 'saldo', Number(event.target.value))}
            className="w-full rounded-lg border border-border bg-surface2 px-4 py-3 font-mono text-text placeholder:text-muted transition focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
          />
          {errors.saldo ? <span className="mt-2 block text-sm text-danger">{errors.saldo}</span> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-snow">{t('debt.rateLabel')}</span>
          <input
            type="number"
            min="0"
            max="500"
            value={debt.tasa || ''}
            onChange={(event) => onChange(debt.id, 'tasa', Number(event.target.value))}
            className="w-full rounded-lg border border-border bg-surface2 px-4 py-3 font-mono text-text placeholder:text-muted transition focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
          />
          {errors.tasa ? <span className="mt-2 block text-sm text-danger">{errors.tasa}</span> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-snow">
            {t('debt.minimumLabel')} <span className="font-mono text-muted">{currency}</span>
          </span>
          <input
            type="number"
            min="0"
            value={debt.cuotaMin || ''}
            onChange={(event) => onChange(debt.id, 'cuotaMin', Number(event.target.value))}
            className="w-full rounded-lg border border-border bg-surface2 px-4 py-3 font-mono text-text placeholder:text-muted transition focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
          />
          {errors.cuotaMin ? <span className="mt-2 block text-sm text-danger">{errors.cuotaMin}</span> : null}
        </label>
      </div>
    </motion.div>
  )
}
