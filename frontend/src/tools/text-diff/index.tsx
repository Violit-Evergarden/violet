import { useEffect, useMemo, useState } from 'react'
import * as Diff from 'diff'
import { getToolById } from '../../catalog/tools'
import { ToolLayout, ToolSplitPane, splitPaneInputClass } from '../../components/layout/ToolPageShell'
import { usePageMeta } from '../../hooks/usePageMeta'
import { recordToolVisit } from '../../hooks/useRecentTools'
import { cn } from '../../lib/cn'

const tool = getToolById('text-diff')!

export default function TextDiffTool() {
  usePageMeta(tool.name, tool.description)
  useEffect(() => {
    recordToolVisit(tool.id)
  }, [])

  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')

  const parts = useMemo(() => {
    if (!left && !right) return []
    return Diff.diffLines(left, right)
  }, [left, right])

  return (
    <ToolLayout title={tool.name} width="wide">
      <ToolSplitPane
        leftLabel="文本 A"
        rightLabel="文本 B"
        left={
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="第一段文本…"
            className={splitPaneInputClass}
            spellCheck={false}
          />
        }
        right={
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="第二段文本…"
            className={splitPaneInputClass}
            spellCheck={false}
          />
        }
      />
      {parts.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-xl border border-app bg-surface">
          <div className="border-b border-app px-4 py-2 text-xs font-medium text-subtle">差异</div>
          <pre className="max-h-64 overflow-auto px-4 py-3 font-mono text-xs leading-6 whitespace-pre-wrap sm:text-sm">
            {parts.map((part, index) => (
              <span
                key={index}
                className={cn(
                  part.added && 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-100',
                  part.removed && 'bg-red-500/20 text-red-900 line-through dark:text-red-100',
                )}
              >
                {part.value}
              </span>
            ))}
          </pre>
        </div>
      )}
    </ToolLayout>
  )
}
