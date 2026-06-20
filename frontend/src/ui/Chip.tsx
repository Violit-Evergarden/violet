import { cn } from '../lib/cn'

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

export function Chip({ selected, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-full px-4 py-1.5 text-sm font-medium transition',
        selected
          ? 'bg-[var(--color-brand)] text-white shadow-sm'
          : 'border border-app bg-surface text-muted hover:border-[var(--color-brand)] hover:text-brand',
        className,
      )}
      aria-pressed={selected}
      {...props}
    >
      {children}
    </button>
  )
}
