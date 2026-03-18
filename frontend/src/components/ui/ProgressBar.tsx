interface ProgressBarProps {
  progress: number
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface2">
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent via-accent to-gold transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}
