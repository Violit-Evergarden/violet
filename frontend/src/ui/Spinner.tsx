import { cn } from '../lib/cn'

export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md'; className?: string }) {
  return (
    <span
      role="status"
      aria-label="加载中"
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5',
        className,
      )}
    />
  )
}
