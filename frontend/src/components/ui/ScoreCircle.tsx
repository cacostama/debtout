import { motion } from 'framer-motion'

import { useI18n } from '../../lib/i18n'

interface ScoreCircleProps {
  score: number
}

export function ScoreCircle({ score }: ScoreCircleProps) {
  const { t } = useI18n()
  const radius = 74
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (Math.max(0, Math.min(score, 100)) / 100) * circumference

  return (
    <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={radius} stroke="rgba(30,39,48,1)" strokeWidth="14" fill="transparent" />
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          stroke="rgba(0,229,160,1)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-medium text-text">{score}/100</span>
        <span className="mt-2 text-sm uppercase tracking-[0.24em] text-snow">{t('result.scoreLabel')}</span>
      </div>
    </div>
  )
}
