import { Link } from 'react-router-dom'
import type { ToolDefinition } from '../catalog/tools'

interface ToolCardProps {
  tool: ToolDefinition
}

function StatusBadge({ status }: { status: ToolDefinition['status'] }) {
  if (!status || status === 'live') return null
  const label = status === 'beta' ? 'Beta' : '即将上线'
  const className =
    status === 'beta'
      ? 'border-amber-500/40 bg-amber-950/40 text-amber-200'
      : 'border-slate-600 bg-slate-800 text-slate-400'
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs ${className}`}>{label}</span>
  )
}

export function ToolCard({ tool }: ToolCardProps) {
  const disabled = tool.status === 'soon'
  const content = (
    <>
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl">
          {tool.icon}
        </span>
        <StatusBadge status={tool.status} />
      </div>
      <h3 className="text-base font-semibold text-white">{tool.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{tool.description}</p>
      {tool.tags && tool.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  )

  const className = `block rounded-2xl border p-5 transition ${
    disabled
      ? 'cursor-not-allowed border-slate-800 bg-slate-900/40 opacity-60'
      : 'border-slate-700 bg-slate-900/70 hover:border-sky-500/50 hover:bg-slate-900'
  }`

  if (disabled) {
    return <article className={className}>{content}</article>
  }

  if (tool.kind === 'external' && tool.href) {
    return (
      <a href={tool.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  }

  if (tool.path) {
    return (
      <Link to={tool.path} className={className}>
        {content}
      </Link>
    )
  }

  return <article className={className}>{content}</article>
}
