import { useMemo, useState } from 'react'
import { Button } from '../../ui/Button'

type Mode = 'format' | 'minify'

export default function JsonFormatterTool() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('format')
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: '' }
    }
    try {
      const parsed = JSON.parse(input)
      const formatted =
        mode === 'format' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed)
      return { output: formatted, error: '' }
    } catch {
      return { output: '', error: 'JSON 格式无效，请检查语法' }
    }
  }, [input, mode])

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-sky-300">JSON</p>
        <h1 className="text-3xl font-bold text-white">JSON 格式化</h1>
        <p className="text-sm text-slate-400">校验 JSON 语法，支持美化或压缩，纯前端处理不上传服务器。</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode('format')}
          className={`rounded-lg px-4 py-2 text-sm ${
            mode === 'format' ? 'bg-sky-500 text-white' : 'border border-slate-700 text-slate-400'
          }`}
        >
          美化
        </button>
        <button
          type="button"
          onClick={() => setMode('minify')}
          className={`rounded-lg px-4 py-2 text-sm ${
            mode === 'minify' ? 'bg-sky-500 text-white' : 'border border-slate-700 text-slate-400'
          }`}
        >
          压缩
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <label htmlFor="json-input" className="mb-2 block text-sm font-medium text-slate-300">
            输入 JSON
          </label>
          <textarea
            id="json-input"
            rows={16}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name":"violet","tools":["video-transcript"]}'
            className="w-full resize-y rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-sky-400"
          />
        </section>
        <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">输出</span>
            <Button variant="secondary" onClick={handleCopy} disabled={!output}>
              {copied ? '已复制' : '复制'}
            </Button>
          </div>
          {error ? (
            <p className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : (
            <pre className="max-h-[28rem] overflow-auto rounded-xl bg-slate-950 p-3 font-mono text-sm leading-6 text-slate-200 whitespace-pre-wrap">
              {output || '格式化结果将显示在这里'}
            </pre>
          )}
        </section>
      </div>
    </div>
  )
}
