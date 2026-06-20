import { Link } from 'react-router-dom'
import type { ToolDefinition } from '../catalog/tools'
import { toolIcons } from '../catalog/tools'
import { cn } from '../lib/cn'
import { Badge } from '../ui/Badge'

interface ToolCardProps {
  tool: ToolDefinition
  compact?: boolean
}

function StatusBadge({ status }: { status: ToolDefinition['status'] }) {
  if (!status || status === 'live') return null
  if (status === 'beta') return <Badge variant="warning">Beta</Badge>
  return <Badge variant="default">即将上线</Badge>
}

export function ToolCard({ tool, compact }: ToolCardProps) {
  const Icon = toolIcons[tool.icon]
  const disabled = tool.status === 'soon'

  const content = (
    <>
      <div className={cn('flex items-start justify-between gap-2', compact ? 'mb-3' : 'mb-4')}>
        <span
          className={cn(
            'flex items-center justify-center rounded-lg bg-[var(--color-brand-muted)] text-brand',
            compact ? 'h-9 w-9' : 'h-11 w-11',
          )}
        >
          <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden />
        </span>
        <StatusBadge status={tool.status} />
      </div>
      <h3 className={cn('font-semibold text-[var(--color-text)]', compact ? 'text-sm' : 'text-base')}>
        {tool.name}
      </h3>
      <p
        className={cn(
          'mt-2 line-clamp-2 leading-6 text-muted',
          compact ? 'text-xs' : 'text-sm',
        )}
      >
        {tool.description}
      </p>
      {!compact && tool.tags && tool.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[var(--color-border-subtle)] px-2 py-0.5 text-xs text-subtle"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  )

  const className = cn(
    'relative block rounded-xl border border-app bg-surface transition shadow-sm',
    compact ? 'p-4' : 'p-5',
    disabled
      ? 'cursor-not-allowed opacity-60'
      : 'hover:border-[var(--color-brand)] hover:shadow-md',
  )

  if (disabled) return <article className={className}>{content}</article>

  return (
    <Link to={tool.path} className={className}>
      {content}
    </Link>
  )
}
