import { useEffect, useState } from 'react'

export function useAnimatedCounter(target: number, duration = 900): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const startedAt = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      setValue(Math.round(target * (1 - (1 - progress) ** 3)))

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick)
      }
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [duration, target])

  return value
}
