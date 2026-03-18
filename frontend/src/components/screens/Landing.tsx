import { motion } from 'framer-motion'

import { useI18n } from '../../lib/i18n'
import { useStore } from '../../store/useStore'

const pillKeys = ['landing.pillTime', 'landing.pillPrivacy', 'landing.pillAi'] as const

export function Landing() {
  const { t } = useI18n()
  const setScreen = useStore((state) => state.setScreen)

  return (
    <section className="flex min-h-[80vh] items-center justify-center">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-3">
            <h1 className="font-syne text-5xl font-extrabold tracking-tight text-text sm:text-7xl">
              {t('app.brand')}
            </h1>
            <motion.span
              className="mt-4 block h-4 w-4 rounded-full bg-accent shadow-accent"
              animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>

          <p className="mt-8 font-syne text-3xl font-extrabold leading-tight text-text sm:text-5xl">
            {t('app.tagline')}
          </p>
          <p className="mt-4 font-mono text-sm uppercase tracking-[0.3em] text-snow sm:text-base">
            {t('app.taglineSecondary')}
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-snow sm:text-lg">{t('app.subtitle')}</p>

          <div className="mt-10">
            <button
              type="button"
              onClick={() => setScreen('step1')}
              className="rounded-2xl bg-accent px-8 py-4 font-syne text-lg font-bold text-bg shadow-[0_0_20px_rgba(0,229,160,0.3)] transition-all duration-200 hover:bg-accent-dim hover:shadow-[0_0_32px_rgba(0,229,160,0.5)]"
            >
              {t('landing.cta')}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {pillKeys.map((key) => (
              <span
                key={key}
                className="rounded-full border border-border bg-surface/80 px-4 py-2 font-mono text-xs text-snow"
              >
                {t(key)}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setScreen('recover')}
            className="mt-8 font-syne text-sm font-semibold text-snow transition hover:text-text"
          >
            {t('landing.recover')}
          </button>
        </motion.div>
      </div>
    </section>
  )
}
