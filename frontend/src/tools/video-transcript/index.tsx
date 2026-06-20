import { useEffect, useState } from 'react'
import type { ExtractResponse } from '@shared/types/api'
import { extractTranscript, fetchHealth } from './api'
import { InputPanel } from './components/InputPanel'
import { ResultPanel } from './components/ResultPanel'
import { StatusBar } from './components/StatusBar'

export default function VideoTranscriptTool() {
  const [shareText, setShareText] = useState('')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState('')
  const [error, setError] = useState('')
  const [warnings, setWarnings] = useState<string[]>([])
  const [result, setResult] = useState<ExtractResponse | null>(null)

  useEffect(() => {
    fetchHealth()
      .then((health) => {
        const nextWarnings: string[] = []
        if (!health.ffmpeg_available) {
          nextWarnings.push('后端未检测到 ffmpeg，请先安装 ffmpeg')
        }
        if (!health.api_key_configured) {
          nextWarnings.push('未配置 SILICONFLOW_API_KEY，语音识别不可用')
        }
        setWarnings(nextWarnings)
      })
      .catch(() => {
        setWarnings(['后端服务未启动，请先运行 uvicorn'])
      })
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    setStage('正在解析链接并下载视频，请稍候...')

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

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Video Transcript</p>
        <h1 className="text-3xl font-bold text-white">抖音视频文案提取</h1>
        <p className="text-sm text-slate-400">
          粘贴抖音分享文本，自动识别视频中的语音并转为文字。
        </p>
      </header>

      <StatusBar loading={loading} stage={stage} error={error} warnings={warnings} />

      <InputPanel
        value={shareText}
        loading={loading}
        onChange={setShareText}
        onSubmit={handleSubmit}
      />

      {result && (
        <ResultPanel
          title={result.title}
          videoId={result.video_id}
          transcript={result.transcript}
          durationSeconds={result.duration_seconds}
        />
      )}
    </div>
  )
}
