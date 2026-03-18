import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { ProgressBar } from '../ui/ProgressBar'
import { useI18n } from '../../lib/i18n'

const loadingKeys = [
  'loading.message1',
  'loading.message2',
  'loading.message3',
  'loading.message4',
  'loading.message5'
] as const

export function Loading() {
  const { t } = useI18n()
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const textTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % loadingKeys.length)
    }, 2500)

    const startedAt = performance.now()
    let frame = 0
    const animate = (now: number) => {
      const elapsed = now - startedAt
      const next = Math.min(90, (elapsed / 8000) * 90)
      setProgress(next)
      if (next < 90) {
        frame = window.requestAnimationFrame(animate)
      }
    }

    frame = window.requestAnimationFrame(animate)

    return () => {
      window.clearInterval(textTimer)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-[28px] border border-border bg-surface/90 p-8 text-center">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-accent/20 bg-surface2 shadow-accent"
        >
          <span className="font-syne text-3xl font-extrabold text-text">D</span>
        </motion.div>
        <h2 className="mt-6 font-syne text-3xl font-extrabold text-text">{t('loading.title')}</h2>
        <p className="mt-4 min-h-[56px] text-lg text-snow">{t(loadingKeys[messageIndex])}</p>
        <div className="mt-8">
          <ProgressBar progress={progress} />
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.28em] text-muted">{t('loading.poweredBy')}</p>
      </div>
    </section>
  )
}
