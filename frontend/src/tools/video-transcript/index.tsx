import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { ExtractResponse } from '@shared/types/api'
import { getToolById } from '../../catalog/tools'
import { ToolLayout } from '../../components/layout/ToolPageShell'
import { usePageMeta } from '../../hooks/usePageMeta'
import { recordToolVisit } from '../../hooks/useRecentTools'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { Textarea } from '../../ui/Input'
import { Spinner } from '../../ui/Spinner'
import { extractTranscript, fetchHealth } from './api'

const tool = getToolById('video-transcript')!

export default function VideoTranscriptTool() {
  usePageMeta(tool.name, tool.description)

  useEffect(() => {
    recordToolVisit(tool.id)
  }, [])

  const [shareText, setShareText] = useState('')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState('')
  const [error, setError] = useState('')
  const [warnings, setWarnings] = useState<string[]>([])
  const [result, setResult] = useState<ExtractResponse | null>(null)

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

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    setStage('正在解析链接并下载视频…')

    try {
      const response = await extractTranscript(shareText.trim())
      setResult(response)
      setStage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '提取失败')
    } finally {
      setLoading(false)
    }
  }

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
        {warnings.length > 0 && !error && <Alert variant="warning">{warnings.join(' · ')}</Alert>}
        {error && <Alert variant="error">{error}</Alert>}
        {loading && (
          <Alert variant="info">
            <span className="inline-flex items-center gap-2">
              <Spinner size="sm" />
              {stage}
            </span>
          </Alert>
        )}

        <Card padding="md">
          <Textarea
            rows={5}
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            placeholder="粘贴抖音分享文本或 v.douyin.com 短链…"
            disabled={loading}
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={handleSubmit} loading={loading} disabled={!shareText.trim()}>
              提取
            </Button>
          </div>
        </Card>

        {result && (
          <Card padding="md">
            <p className="mb-3 text-xs text-muted">
              {result.title} · {Math.round(result.duration_seconds)} 秒
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
