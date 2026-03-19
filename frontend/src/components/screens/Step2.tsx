import { AnimatePresence } from 'framer-motion'

import { DebtCard } from '../ui/DebtCard'
import { formatCurrency, getDebtTotals } from '../../lib/calculations'
import { useI18n } from '../../lib/i18n'
import { useStore } from '../../store/useStore'
import type { Debt } from '../../types'

type DebtErrors = Partial<Record<'nombre' | 'saldo' | 'tasa' | 'cuotaMin', string>>

function validateDebt(
  debt: Debt,
  t: ReturnType<typeof useI18n>['t']
): Partial<Record<'nombre' | 'saldo' | 'tasa' | 'cuotaMin', string>> {
  const errors: DebtErrors = {}

  if (!debt.nombre.trim()) {
    errors.nombre = t('step2.validationRequired')
  }
  if (debt.saldo <= 0) {
    errors.saldo = t('step2.validationBalance')
  }
  if (debt.tasa < 0 || debt.tasa > 500) {
    errors.tasa = t('step2.validationRate')
  }
  if (debt.cuotaMin < 0) {
    errors.cuotaMin = t('step2.validationMinimum')
  }

  return errors
}

export function Step2() {
  const { t, lang } = useI18n()
  const { deudas, moneda } = useStore((state) => state.userData)
  const updateDebt = useStore((state) => state.updateDebt)
  const addDebt = useStore((state) => state.addDebt)
  const removeDebt = useStore((state) => state.removeDebt)
  const setScreen = useStore((state) => state.setScreen)
  const setError = useStore((state) => state.setError)

  const totals = getDebtTotals(deudas)
  const errorsByDebt = Object.fromEntries(deudas.map((debt) => [debt.id, validateDebt(debt, t)]))

  const handleContinue = () => {
    const hasErrors = deudas.some((debt) => Object.keys(validateDebt(debt, t)).length > 0)
    if (hasErrors) {
      setError(t('step2.validationRequired'))
      return
    }
    setError(null)
    setScreen('step3')
  }

  const handleDebtChange = (id: string, field: keyof Debt, value: string | number) => {
    updateDebt(id, { [field]: value } as Partial<Debt>)
    setError(null)
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="rounded-[28px] border border-border bg-surface/90 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">{t('step2.eyebrow')}</p>
        <h2 className="mt-4 font-syne text-3xl font-extrabold text-text sm:text-4xl">{t('step2.title')}</h2>
        <p className="mt-3 text-snow">{t('step2.description')}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {deudas.map((debt, index) => (
                <DebtCard
                  key={debt.id}
                  debt={debt}
                  index={index}
                  currency={moneda}
                  canRemove={deudas.length > 1}
                  errors={errorsByDebt[debt.id] ?? {}}
                  onChange={handleDebtChange}
                  onRemove={removeDebt}
                />
              ))}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => {
                if (deudas.length >= 8) {
                  setError(t('step2.limitReached'))
                  return
                }
                setError(null)
                addDebt()
              }}
              className="rounded-xl border border-border px-6 py-3 font-syne font-semibold text-snow transition hover:border-accent/50 hover:text-text"
            >
              {t('step2.addDebt')}
            </button>
          </div>

          <aside className="h-fit rounded-2xl border border-accent/20 bg-surface p-5 shadow-accent">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">{t('step2.summaryCount')}</p>
            <p className="mt-2 font-mono text-3xl text-text">{deudas.length}</p>
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-snow">{t('step2.summaryTotal')}</p>
                <p className="mt-1 font-mono text-xl text-text">{formatCurrency(totals.totalBalance, moneda, lang)}</p>
              </div>
              <div>
                <p className="text-sm text-snow">{t('step2.summaryMin')}</p>
                <p className="mt-1 font-mono text-xl text-text">{formatCurrency(totals.totalMinimum, moneda, lang)}</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setScreen('step1')}
            className="font-syne text-sm font-semibold text-snow transition hover:text-text"
          >
            {t('common.back')}
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="rounded-xl bg-accent px-7 py-3 font-syne font-bold text-bg transition hover:bg-accent-dim hover:shadow-accent-strong"
          >
            {t('step2.continue')}
          </button>
        </div>
      </div>
    </section>
  )
}
