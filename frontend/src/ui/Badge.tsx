import { cn } from '../lib/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'brand' | 'warning' | 'success'
}

const variants = {
  default: 'bg-[var(--color-border-subtle)] text-muted border border-app',
  brand: 'bg-[var(--color-brand-muted)] text-brand border border-[color-mix(in_srgb,var(--color-brand)_30%,transparent)]',
  warning: 'bg-amber-500/10 text-[var(--color-warning)] border border-amber-500/20',
  success: 'bg-emerald-500/10 text-[var(--color-success)] border border-emerald-500/20',
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
      )}
    >
      {children}
    </span>
  )
}
