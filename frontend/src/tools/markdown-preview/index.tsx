import { useEffect, useMemo, useState } from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { getToolById } from '../../catalog/tools'
import { ToolLayout, ToolSplitPane, splitPaneInputClass } from '../../components/layout/ToolPageShell'
import { usePageMeta } from '../../hooks/usePageMeta'
import { recordToolVisit } from '../../hooks/useRecentTools'

const tool = getToolById('markdown-preview')!

marked.setOptions({ gfm: true, breaks: true })

export default function MarkdownPreviewTool() {
  usePageMeta(tool.name, tool.description)
  useEffect(() => {
    recordToolVisit(tool.id)
  }, [])

  const [source, setSource] = useState(`# 标题

输入 **Markdown**，右侧实时预览。

- 列表项
- 代码块

\`\`\`js
console.log('hello')
\`\`\`
`)

  const html = useMemo(() => {
    if (!source.trim()) return ''
    const raw = marked.parse(source, { async: false }) as string
    return DOMPurify.sanitize(raw)
  }, [source])

  return (
    <ToolLayout title={tool.name} width="wide">
      <ToolSplitPane
        leftLabel="Markdown"
        rightLabel="预览"
        left={
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className={splitPaneInputClass}
            spellCheck={false}
          />
        }
        right={
          html ? (
            <article
              className="markdown-preview px-4 py-3 text-sm leading-7 text-[var(--color-text)]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <p className="px-4 py-3 text-sm text-muted"> </p>
          )
        }
      />
    </ToolLayout>
  )
}
