interface StatusBarProps {
  loading: boolean
  stage: string
  error: string
  warnings: string[]
}

export function StatusBar({ loading, stage, error, warnings }: StatusBarProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-sky-500/30 bg-sky-950/30 px-4 py-3 text-sm text-sky-100">
        <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-sky-300 border-t-transparent" />
        {stage}
      </div>
    )
  }

  if (warnings.length > 0) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
        {warnings.join(' · ')}
      </div>
    )
  }

  return null
}
