import { cn } from '../lib/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({ children, className, padding = 'lg' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-app bg-surface shadow-sm',
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
