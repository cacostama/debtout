import { useMemo, useState } from 'react'

import { useI18n } from '../../lib/i18n'
import { useStore } from '../../store/useStore'
import type { Currency } from '../../types'

const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'PYG', 'ARS', 'BRL', 'COP', 'MXN']

export function Step1() {
  const { lang, setLang, t } = useI18n()
  const { nombre, extraMensual, moneda } = useStore((state) => state.userData)
  const setUserData = useStore((state) => state.setUserData)
  const setScreen = useStore((state) => state.setScreen)
  const [touched, setTouched] = useState(false)

  const extraError = useMemo(() => {
    if (!touched) {
      return ''
    }
    return extraMensual >= 0 ? '' : t('step1.validationExtra')
  }, [extraMensual, t, touched])

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="rounded-[28px] border border-border bg-surface/90 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">{t('step1.eyebrow')}</p>
        <h2 className="mt-4 font-syne text-3xl font-extrabold text-text sm:text-4xl">{t('step1.title')}</h2>
        <p className="mt-3 text-snow">{t('step1.description')}</p>

        <div className="mt-8 space-y-6">
          <label className="block">
            <span className="mb-2 block text-sm text-snow">{t('step1.nameLabel')}</span>
            <input
              value={nombre}
              onChange={(event) => setUserData({ nombre: event.target.value })}
              placeholder={t('step1.namePlaceholder')}
              className="w-full rounded-lg border border-border bg-surface2 px-4 py-3 font-syne text-text placeholder:text-muted transition focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-[1fr_132px]">
            <label className="block">
              <span className="mb-2 block text-sm text-snow">{t('step1.extraLabel')}</span>
              <input
                type="number"
                min="0"
                value={extraMensual || ''}
                onBlur={() => setTouched(true)}
                onChange={(event) => setUserData({ extraMensual: Number(event.target.value) })}
                className="w-full rounded-lg border border-border bg-surface2 px-4 py-3 font-mono text-text placeholder:text-muted transition focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
              />
              {extraError ? <span className="mt-2 block text-sm text-danger">{extraError}</span> : null}
              {extraMensual === 0 ? <span className="mt-2 block text-sm text-accent2">{t('step1.warningZero')}</span> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-snow">{t('step1.currencyLabel')}</span>
              <select
                value={moneda}
                onChange={(event) => setUserData({ moneda: event.target.value as Currency })}
                className="w-full rounded-lg border border-border bg-surface2 px-4 py-3 font-mono text-text transition focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <span className="mb-3 block text-sm text-snow">{t('step1.langLabel')}</span>
            <div className="inline-flex rounded-xl border border-border bg-surface2 p-1">
              {(['es', 'en'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLang(value)}
                  className={`rounded-lg px-5 py-2 font-syne text-sm font-semibold transition ${
                    lang === value ? 'bg-accent text-bg' : 'text-snow'
                  }`}
                >
                  {t(`common.${value}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setScreen('landing')}
            className="font-syne text-sm font-semibold text-snow transition hover:text-text"
          >
            {t('common.back')}
          </button>
          <button
            type="button"
            onClick={() => setScreen('step2')}
            className="rounded-xl bg-accent px-7 py-3 font-syne font-bold text-bg transition hover:bg-accent-dim hover:shadow-accent-strong"
          >
            {t('step1.continue')}
          </button>
        </div>
      </div>
    </section>
  )
}
