import { useI18n } from '../../lib/i18n'
import type { Strategy } from '../../types'

interface StrategyCardProps {
  strategy: Strategy
  selected: boolean
  recommended?: boolean
  onSelect: (strategy: Strategy) => void
}

export function StrategyCard({ strategy, selected, recommended = false, onSelect }: StrategyCardProps) {
  const { t } = useI18n()

  return (
    <button
      type="button"
      onClick={() => onSelect(strategy)}
      className={`relative rounded-2xl border p-5 text-left transition duration-200 ${
        selected
          ? 'border-accent bg-surface shadow-accent'
          : 'border-border bg-surface hover:border-accent/40 hover:bg-surface2'
      }`}
    >
      {recommended ? (
        <span className="absolute right-4 top-4 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
          {t('strategy.recommended')}
        </span>
      ) : null}
      <h3 className="pr-28 font-syne text-xl font-bold text-text">{t(`strategy.${strategy}.title`)}</h3>
      <p className="mt-3 text-sm leading-6 text-snow">{t(`strategy.${strategy}.description`)}</p>
    </button>
  )
}
