import { cn } from '../lib/cn'

interface TabsProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
  className?: string
}

export function Tabs<T extends string>({ value, onChange, options, className }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn('inline-flex rounded-xl border border-app bg-[var(--color-border-subtle)] p-1', className)}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-lg px-4 py-1.5 text-sm font-medium transition',
            value === opt.value
              ? 'bg-surface text-[var(--color-text)] shadow-sm'
              : 'text-muted hover:text-[var(--color-text)]',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
