import { formatCurrency, formatPercent } from '../../lib/calculations'
import { useI18n } from '../../lib/i18n'
import type { Currency, PaymentOrder } from '../../types'

interface TimelineItemProps {
  item: PaymentOrder
  currency: Currency
}

export function TimelineItem({ item, currency }: TimelineItemProps) {
  const { lang, t } = useI18n()

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">{item.orden}</p>
          <h4 className="mt-1 font-syne text-lg font-bold text-text">{item.nombre}</h4>
        </div>
        <span className="font-mono text-sm text-snow">{item.mes_liquidacion}</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">{t('result.balanceLabel')}</p>
          <p className="mt-1 font-mono text-text">{formatCurrency(item.saldo, currency, lang)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">{t('result.paymentLabel')}</p>
          <p className="mt-1 font-mono text-text">{formatCurrency(item.pago_mensual, currency, lang)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">{t('result.shareLabel')}</p>
          <p className="mt-1 font-mono text-text">
            {t('result.timelineShare', { value: `${formatPercent(item.porcentaje_del_total, lang)}%` })}
          </p>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-surface2">
        <div
          className="h-2 rounded-full bg-accent"
          style={{ width: `${Math.min(100, Math.max(8, item.porcentaje_del_total))}%` }}
        />
      </div>
    </div>
  )
}
