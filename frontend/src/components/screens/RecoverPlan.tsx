import { useState } from 'react'

import { useDebtPlan } from '../../hooks/useDebtPlan'
import { formatPin } from '../../lib/calculations'
import { useI18n } from '../../lib/i18n'
import { useStore } from '../../store/useStore'

export function RecoverPlan() {
  const { t } = useI18n()
  const setScreen = useStore((state) => state.setScreen)
  const { recoverPlan, isRecovering } = useDebtPlan()
  const [pin, setPin] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleRecover = async () => {
    if (pin.length !== 7) {
      setLocalError(t('error.invalid_pin'))
      return
    }

    setLocalError(null)

    try {
      await recoverPlan(pin)
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : ''
      if (message.includes('No encontramos') || message.includes('could not find')) {
        setLocalError(t('error.no_plan'))
        return
      }
      if (message.includes('expir')) {
        setLocalError(t('error.expired_plan'))
        return
      }
      setLocalError(t('error.recover'))
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="rounded-[28px] border border-border bg-surface/90 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">{t('recover.eyebrow')}</p>
        <h2 className="mt-4 font-syne text-3xl font-extrabold text-text sm:text-4xl">{t('recover.title')}</h2>
        <p className="mt-3 text-snow">{t('recover.description')}</p>

        <label className="mt-8 block">
          <span className="mb-2 block text-sm text-snow">{t('recover.label')}</span>
          <input
            value={pin}
            onChange={(event) => {
              setLocalError(null)
              const rawValue = event.target.value.replace(/[^\d-]/g, '')
              setPin(formatPin(rawValue))
            }}
            placeholder={t('recover.placeholder')}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={7}
            pattern="\d{3}-\d{3}"
            className="w-full rounded-lg border border-border bg-surface2 px-4 py-3 font-mono text-2xl tracking-[0.26em] text-text placeholder:text-muted transition focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
          />
        </label>

        {localError ? <p className="mt-3 text-sm text-danger">{localError}</p> : null}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setScreen('landing')}
            className="font-syne text-sm font-semibold text-snow transition hover:text-text"
          >
            {t('recover.back')}
          </button>
          <button
            type="button"
            disabled={isRecovering}
            onClick={handleRecover}
            className="rounded-xl bg-accent px-7 py-3 font-syne font-bold text-bg transition hover:bg-accent-dim hover:shadow-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {t('recover.button')}
          </button>
        </div>
      </div>
    </section>
  )
}
