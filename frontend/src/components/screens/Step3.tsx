import { StrategyCard } from '../ui/StrategyCard'
import { useDebtPlan } from '../../hooks/useDebtPlan'
import { useI18n } from '../../lib/i18n'
import { useStore } from '../../store/useStore'
import type { Strategy } from '../../types'

const strategies: Strategy[] = ['snowball', 'avalanche', 'consolidation', 'ai']

export function Step3() {
  const { t, lang } = useI18n()
  const userData = useStore((state) => state.userData)
  const setUserData = useStore((state) => state.setUserData)
  const setScreen = useStore((state) => state.setScreen)
  const setError = useStore((state) => state.setError)
  const { generatePlan, isGenerating } = useDebtPlan()

  const handleGenerate = async () => {
    try {
      setScreen('loading')
      await generatePlan({
        nombre: userData.nombre,
        extra_mensual: userData.extraMensual,
        moneda: userData.moneda,
        estrategia: userData.estrategia,
        lang,
        deudas: userData.deudas.map((debt) => ({
          nombre: debt.nombre.trim(),
          saldo: debt.saldo,
          tasa: debt.tasa,
          cuota_min: debt.cuotaMin
        }))
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : t('error.generate'))
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="rounded-[28px] border border-border bg-surface/90 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">{t('step3.eyebrow')}</p>
        <h2 className="mt-4 font-syne text-3xl font-extrabold text-text sm:text-4xl">{t('step3.title')}</h2>
        <p className="mt-3 max-w-2xl text-snow">{t('step3.description')}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {strategies.map((strategy) => (
            <StrategyCard
              key={strategy}
              strategy={strategy}
              selected={userData.estrategia === strategy}
              recommended={strategy === 'ai'}
              onSelect={(value) => setUserData({ estrategia: value })}
            />
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setScreen('step2')}
            className="font-syne text-sm font-semibold text-snow transition hover:text-text"
          >
            {t('common.back')}
          </button>
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="rounded-xl bg-accent px-7 py-3 font-syne font-bold text-bg transition hover:bg-accent-dim hover:shadow-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {t('step3.generate')}
          </button>
        </div>
      </div>
    </section>
  )
}
