import { useState } from 'react'
import { motion } from 'framer-motion'

import { MetricCard } from '../ui/MetricCard'
import { PinDisplay } from '../ui/PinDisplay'
import { ScoreCircle } from '../ui/ScoreCircle'
import { TimelineItem } from '../ui/TimelineItem'
import { buildPlanClipboardText } from '../../lib/calculations'
import { useI18n } from '../../lib/i18n'
import { useStore } from '../../store/useStore'

const STRATEGY_DISPLAY_NAMES: Record<string, string> = {
  ai: 'Plan Personalizado IA',
  snowball: 'Bola de Nieve',
  avalanche: 'Alud / Avalancha',
  consolidation: 'Consolidación',
}

export function Result() {
  const { t, lang } = useI18n()
  const resultado = useStore((state) => state.resultado)
  const pin = useStore((state) => state.pin)
  const userData = useStore((state) => state.userData)
  const reset = useStore((state) => state.reset)
  const setScreen = useStore((state) => state.setScreen)
  const [copied, setCopied] = useState(false)

  if (!resultado || !pin) {
    return null
  }

  const totalDebt = resultado.orden_pago.reduce((sum, item) => sum + item.saldo, 0)
  const interesesAhorrados = Number(resultado.intereses_ahorrados ?? 0)
  console.log('[DebtOut] intereses_ahorrados raw:', resultado.intereses_ahorrados, typeof resultado.intereses_ahorrados, '→ parsed:', interesesAhorrados)

  const handleCopyPlan = async () => {
    const content = buildPlanClipboardText(resultado, userData.moneda, lang, userData.nombre)
    await navigator.clipboard.writeText(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="space-y-6">
        <div className="rounded-[28px] border border-border bg-surface/90 p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 className="font-syne text-3xl font-extrabold text-text sm:text-5xl">
                {userData.nombre.trim() ? t('result.titleNamed', { name: userData.nombre.trim() }) : t('result.titleAnon')}
              </h2>
              <p className="mt-5 font-syne text-2xl font-bold text-gold sm:text-3xl">
                {t('result.freedomDate', { date: resultado.fecha_libertad })}
              </p>
            </div>
            <ScoreCircle score={resultado.score} />
          </div>
        </div>

        <PinDisplay pin={pin} />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setScreen('step2')}
            className="rounded-xl border border-accent3/40 px-5 py-2.5 font-syne text-sm font-semibold text-accent3 transition hover:border-accent3 hover:bg-accent3/10"
          >
            {t('result.addDebt')}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label={t('result.totalDebt')}
            value={Math.round(totalDebt)}
            currency={userData.moneda}
            format="currency"
            tooltip={t('result.tooltip.totalDebt')}
          />
          <MetricCard
            label={t('result.totalTime')}
            value={resultado.meses_total}
            format="months"
            tooltip={t('result.tooltip.totalTime')}
          />
          <MetricCard
            label={t('result.savedInterest')}
            value={interesesAhorrados}
            currency={userData.moneda}
            format="currency"
            tooltip={t('result.tooltip.savedInterest')}
          />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">{t('result.strategy')}</p>
          <h3 className="mt-3 font-syne text-2xl font-bold text-text">{STRATEGY_DISPLAY_NAMES[resultado.estrategia_usada] ?? resultado.estrategia_usada}</h3>
          <p className="mt-4 whitespace-pre-line leading-7 text-snow">{resultado.razon_estrategia}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">{t('result.timeline')}</p>
          <div className="mt-5 space-y-4">
            {resultado.orden_pago.map((item) => (
              <motion.div
                key={`${item.orden}-${item.nombre}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.orden * 0.07 }}
              >
                <TimelineItem item={item} currency={userData.moneda} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className={`grid gap-4 ${resultado.aplica_consolidacion && resultado.consejo_consolidacion ? 'lg:grid-cols-2' : ''}`}>
          <div className="rounded-2xl border border-accent3/30 bg-surface p-6 shadow-info">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent3">{t('result.latam')}</p>
            <p className="mt-4 leading-7 text-snow">{resultado.consejo_financiero}</p>
          </div>

          {resultado.aplica_consolidacion && resultado.consejo_consolidacion ? (
            <div className="rounded-2xl border border-accent/20 bg-surface p-6 shadow-accent">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">{t('result.consolidation')}</p>
              <p className="mt-4 leading-7 text-snow">{resultado.consejo_consolidacion}</p>
            </div>
          ) : null}
        </div>

        {resultado.advertencia ? (
          <div className="rounded-2xl border border-accent2/30 bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent2">{t('result.warning')}</p>
            <p className="mt-4 leading-7 text-snow">{resultado.advertencia}</p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-accent/20 bg-surface p-6 text-center shadow-accent">
          <p className="font-syne text-2xl font-extrabold leading-tight text-accent sm:text-3xl">
            {resultado.mensaje_motivacional}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopyPlan}
            className="rounded-xl bg-accent px-7 py-3 font-syne font-bold text-bg transition hover:bg-accent-dim hover:shadow-accent-strong"
          >
            {copied ? t('result.copyPlanDone') : t('result.copyPlan')}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-border px-7 py-3 font-syne font-semibold text-snow transition hover:border-accent/50 hover:text-text"
          >
            {t('result.newPlan')}
          </button>
        </div>
      </div>
    </section>
  )
}
