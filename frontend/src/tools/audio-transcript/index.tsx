import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { AudioTranscriptResponse } from '@shared/types/api'
import { getToolById } from '../../catalog/tools'
import { ToolLayout } from '../../components/layout/ToolPageShell'
import { usePageMeta } from '../../hooks/usePageMeta'
import { recordToolVisit } from '../../hooks/useRecentTools'
import { fetchHealth } from '../video-transcript/api'
import { transcribeAudio } from './api'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { Spinner } from '../../ui/Spinner'
import { cn } from '../../lib/cn'

const tool = getToolById('audio-transcript')!

export default function AudioTranscriptTool() {
  usePageMeta(tool.name, tool.description)
  useEffect(() => {
    recordToolVisit(tool.id)
  }, [])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AudioTranscriptResponse | null>(null)

  useEffect(() => {
    fetchHealth()
      .then((health) => {
        const next: string[] = []
        if (!health.ffmpeg_available) next.push('后端未检测到 ffmpeg')
        if (!health.api_key_configured) next.push('未配置 SILICONFLOW_API_KEY')
        setWarnings(next)
      })
      .catch(() => setWarnings(['后端服务未启动']))
  }, [])

  const handleFile = useCallback((next: File) => {
    if (!/\.(mp3|wav|m4a|aac|ogg|flac|webm|mp4|mpeg|mpga)$/i.test(next.name)) {
      setError('请上传 mp3、wav、m4a 等音频文件')
      return
    }
    if (next.size > 50 * 1024 * 1024) {
      setError('文件不能超过 50MB')
      return
    }
    setFile(next)
    setError('')
    setResult(null)
  }, [])

  const toolbar = result ? (
    <Button
      variant="secondary"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(result.transcript)
        toast.success('已复制')
      }}
    >
      复制
    </Button>
  ) : undefined

  return (
    <ToolLayout title={tool.name} toolbar={toolbar}>
      <div className="space-y-4">
        {warnings.length > 0 && <Alert variant="warning">{warnings.join(' · ')}</Alert>}
        {error && <Alert variant="error">{error}</Alert>}

        <Card padding="md">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const dropped = e.dataTransfer.files?.[0]
              if (dropped) handleFile(dropped)
            }}
            className={cn(
              'flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-app bg-[var(--color-border-subtle)] p-6 text-center',
              'hover:border-[var(--color-brand)]',
            )}
          >
            <p className="text-sm">{file ? file.name : '点击或拖拽音频文件'}</p>
            <p className="mt-1 text-xs text-muted">最大 50MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.m4a"
            className="sr-only"
            onChange={(e) => {
              const picked = e.target.files?.[0]
              if (picked) handleFile(picked)
              e.target.value = ''
            }}
          />
          <div className="mt-3 flex gap-2">
            <Button
              onClick={async () => {
                if (!file) return
                setLoading(true)
                setError('')
                setResult(null)
                try {
                  setResult(await transcribeAudio(file))
                } catch (err) {
                  setError(err instanceof Error ? err.message : '转写失败')
                } finally {
                  setLoading(false)
                }
              }}
              loading={loading}
              disabled={!file || loading}
            >
              转写
            </Button>
            {file && (
              <Button variant="secondary" onClick={() => { setFile(null); setResult(null); setError('') }}>
                清除
              </Button>
            )}
          </div>
        </Card>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Spinner />
            识别中…
          </div>
        )}

        {result && (
          <Card padding="md">
            <p className="mb-3 text-xs text-muted">
              {result.filename} · {Math.round(result.duration_seconds)} 秒
            </p>
            <div className="max-h-[min(60dvh,32rem)] overflow-y-auto rounded-lg bg-[var(--color-border-subtle)] p-4 text-sm leading-7 whitespace-pre-wrap">
              {result.transcript}
            </div>
          </Card>
        )}
      </div>
    </ToolLayout>
  )
}
