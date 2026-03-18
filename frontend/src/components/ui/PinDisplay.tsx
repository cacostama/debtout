import { useState } from 'react'

import { useI18n } from '../../lib/i18n'

interface PinDisplayProps {
  pin: string
}

export function PinDisplay({ pin }: PinDisplayProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pin)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="rounded-2xl border border-accent/20 bg-[linear-gradient(135deg,rgba(0,229,160,0.14),rgba(15,19,24,0.92))] p-6 shadow-accent">
      <p className="text-sm uppercase tracking-[0.24em] text-accent">{t('result.pinTitle')}</p>
      <p className="mt-4 font-mono text-4xl text-text sm:text-5xl">{pin}</p>
      <p className="mt-4 text-snow">{t('result.pinDescription')}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-xl bg-accent px-5 py-3 font-syne font-bold text-bg transition hover:bg-accent-dim hover:shadow-accent-strong"
        >
          {copied ? t('result.copyPinDone') : t('result.copyPin')}
        </button>
        <span className="text-sm text-snow">{t('result.pinExpiry')}</span>
      </div>
    </div>
  )
}
