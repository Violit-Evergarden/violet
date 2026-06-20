import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { getToolById } from '../../catalog/tools'
import {
  ToolLayout,
  ToolSplitPane,
  splitPaneInputClass,
  splitPaneOutputClass,
} from '../../components/layout/ToolPageShell'
import { usePageMeta } from '../../hooks/usePageMeta'
import { recordToolVisit } from '../../hooks/useRecentTools'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { Tabs } from '../../ui/Tabs'

const tool = getToolById('url-codec')!

type Mode = 'encode' | 'decode' | 'parse'

export default function UrlCodecTool() {
  usePageMeta(tool.name, tool.description)
  useEffect(() => {
    recordToolVisit(tool.id)
  }, [])

  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')

  const { output, error, params } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '', params: [] as [string, string][] }
    try {
      if (mode === 'encode') return { output: encodeURIComponent(input), error: '', params: [] }
      if (mode === 'decode') return { output: decodeURIComponent(input), error: '', params: [] }
      const url = input.includes('://') ? input : `https://${input}`
      const parsed = new URL(url)
      const entries: [string, string][] = []
      parsed.searchParams.forEach((value, key) => entries.push([key, value]))
      return { output: parsed.toString(), error: '', params: entries }
    } catch {
      return {
        output: '',
        error: mode === 'parse' ? 'URL 格式无效' : '处理失败',
        params: [] as [string, string][],
      }
    }
  }, [input, mode])

  const toolbar = (
    <>
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { value: 'encode', label: '编码' },
          { value: 'decode', label: '解码' },
          { value: 'parse', label: '解析' },
        ]}
      />
      <Button
        variant="secondary"
        size="sm"
        disabled={!output}
        onClick={async () => {
          await navigator.clipboard.writeText(output)
          toast.success('已复制')
        }}
      >
        复制
      </Button>
    </>
  )

  return (
    <ToolLayout title={tool.name} width="wide" toolbar={toolbar}>
      <ToolSplitPane
        leftLabel="输入"
        rightLabel={mode === 'parse' ? '解析' : '输出'}
        left={
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'parse' ? 'https://example.com?q=1' : mode === 'encode' ? '待编码文本…' : '待解码文本…'
            }
            className={splitPaneInputClass}
            spellCheck={false}
          />
        }
        right={
          error ? (
            <div className="p-4">
              <Alert variant="error">{error}</Alert>
            </div>
          ) : mode === 'parse' && params.length > 0 ? (
            <div className="space-y-3 p-4">
              <pre className="overflow-auto rounded-lg bg-[var(--color-border-subtle)] p-3 font-mono text-xs break-all">
                {output}
              </pre>
              <table className="w-full text-left text-sm">
                <tbody>
                  {params.map(([key, value]) => (
                    <tr key={key} className="border-t border-app">
                      <td className="py-2 pr-3 font-mono text-xs text-muted">{key}</td>
                      <td className="py-2 font-mono text-xs break-all">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <pre className={splitPaneOutputClass}>{output || ' '}</pre>
          )
        }
      />
    </ToolLayout>
  )
}
