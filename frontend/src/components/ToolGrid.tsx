import type { ToolDefinition } from '../catalog/tools'
import { ToolCard } from './ToolCard'

interface ToolGridProps {
  tools: ToolDefinition[]
  emptyMessage?: string
}

export function ToolGrid({ tools, emptyMessage = '暂无匹配的工具' }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-700 px-6 py-12 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}
