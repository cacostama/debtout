import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Landing } from './components/screens/Landing'
import { Loading } from './components/screens/Loading'
import { RecoverPlan } from './components/screens/RecoverPlan'
import { Result } from './components/screens/Result'
import { Step1 } from './components/screens/Step1'
import { Step2 } from './components/screens/Step2'
import { Step3 } from './components/screens/Step3'
import { useI18n } from './lib/i18n'
import { useStore } from './store/useStore'
import type { Screen } from './types'

const screenVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } }
} as const

const screens: Record<Screen, React.ReactElement> = {
  landing: <Landing />,
  recover: <RecoverPlan />,
  step1: <Step1 />,
  step2: <Step2 />,
  step3: <Step3 />,
  loading: <Loading />,
  result: <Result />
}

function mapErrorToText(error: string | null, t: ReturnType<typeof useI18n>['t']): string | null {
  if (!error) {
    return null
  }
  if (error.includes('XXX-XXX')) {
    return t('error.invalid_pin')
  }
  if (error.includes('No encontramos') || error.includes('could not find')) {
    return t('error.no_plan')
  }
  if (error.includes('expir')) {
    return t('error.expired_plan')
  }
  if (error === 'network_error') {
    return t('error.network_error')
  }
  if (error === 'request_timeout') {
    return t('error.request_timeout')
  }
  if (error === 'unknown_error') {
    return t('error.unknown_error')
  }
  return error
}

export default function App() {
  const screen = useStore((state) => state.screen)
  const error = useStore((state) => state.error)
  const setError = useStore((state) => state.setError)
  const { t } = useI18n()
  const visibleError = mapErrorToText(error, t)

  return (
    <div className="relative min-h-screen overflow-hidden text-text">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid bg-[size:28px_28px] opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(0,229,160,0.14),transparent_55%)]" />
      <main className="relative z-10 mx-auto min-h-screen max-w-7xl py-6">
        <div className="px-4 sm:px-6">
          {visibleError ? (
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-text">
              <span>{visibleError}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="font-mono text-xs uppercase tracking-[0.2em] text-snow"
              >
                x
              </button>
            </div>
          ) : null}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={screen} variants={screenVariants} initial="hidden" animate="visible" exit="exit">
            {screens[screen]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
