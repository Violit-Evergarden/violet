interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'sky' | 'amber'
}

const variants = {
  default: 'border-slate-600 bg-slate-800 text-slate-300',
  sky: 'border-sky-500/40 bg-sky-950/40 text-sky-200',
  amber: 'border-amber-500/40 bg-amber-950/40 text-amber-200',
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${variants[variant]}`}>
      {children}
    </span>
  )
}
