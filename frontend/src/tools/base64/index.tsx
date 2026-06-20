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

const tool = getToolById('base64')!

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary)
}

function decodeBase64(value: string): string {
  const binary = atob(value.trim())
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export default function Base64Tool() {
  usePageMeta(tool.name, tool.description)
  useEffect(() => {
    recordToolVisit(tool.id)
  }, [])

  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' }
    try {
      return {
        output: mode === 'encode' ? encodeBase64(input) : decodeBase64(input),
        error: '',
      }
    } catch {
      return { output: '', error: mode === 'decode' ? 'Base64 格式无效' : '编码失败' }
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
        ]}
      />
      <Button variant="secondary" size="sm" onClick={() => setInput('')} disabled={!input}>
        清空
      </Button>
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
        rightLabel="输出"
        left={
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '输入文本…' : '粘贴 Base64…'}
            className={splitPaneInputClass}
            spellCheck={false}
          />
        }
        right={
          error ? (
            <div className="p-4">
              <Alert variant="error">{error}</Alert>
            </div>
          ) : (
            <pre className={splitPaneOutputClass}>{output || ' '}</pre>
          )
        }
      />
    </ToolLayout>
  )
}
