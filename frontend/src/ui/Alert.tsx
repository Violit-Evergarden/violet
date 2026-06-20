import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { cn } from '../lib/cn'

type AlertVariant = 'info' | 'warning' | 'error' | 'success'

const config: Record<
  AlertVariant,
  { icon: typeof Info; className: string }
> = {
  info: {
    icon: Info,
    className:
      'border-[color-mix(in_srgb,var(--color-brand)_30%,transparent)] bg-[var(--color-brand-muted)] text-[var(--color-text)]',
  },
  warning: {
    icon: TriangleAlert,
    className: 'border-amber-500/30 bg-amber-500/10 text-[var(--color-text)]',
  },
  error: {
    icon: AlertCircle,
    className: 'border-red-500/30 bg-red-500/10 text-[var(--color-text)]',
  },
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-500/30 bg-emerald-500/10 text-[var(--color-text)]',
  },
}

export function Alert({
  variant = 'info',
  children,
  className,
}: {
  variant?: AlertVariant
  children: React.ReactNode
  className?: string
}) {
  const { icon: Icon, className: variantClass } = config[variant]
  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-xl border px-4 py-3 text-sm leading-6',
        variantClass,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
