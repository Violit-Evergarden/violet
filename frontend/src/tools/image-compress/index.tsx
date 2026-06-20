import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { getToolById } from '../../catalog/tools'
import { ToolLayout } from '../../components/layout/ToolPageShell'
import { usePageMeta } from '../../hooks/usePageMeta'
import { recordToolVisit } from '../../hooks/useRecentTools'
import { cn } from '../../lib/cn'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'

const tool = getToolById('image-compress')!

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function compressImage(
  file: File,
  options: { maxWidth: number; quality: number; format: OutputFormat },
) {
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = objectUrl
    })
    const scale = image.width > options.maxWidth ? options.maxWidth / image.width : 1
    const width = Math.round(image.width * scale)
    const height = Math.round(image.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('无法处理图片')
    ctx.drawImage(image, 0, 0, width, height)
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (r) => (r ? resolve(r) : reject(new Error('压缩失败'))),
        options.format,
        options.quality,
      )
    })
    return { blob, previewUrl: URL.createObjectURL(blob), width, height }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export default function ImageCompressTool() {
  usePageMeta(tool.name, tool.description)
  useEffect(() => {
    recordToolVisit(tool.id)
  }, [])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourcePreview, setSourcePreview] = useState('')
  const [resultPreview, setResultPreview] = useState('')
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [resultSize, setResultSize] = useState(0)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [quality, setQuality] = useState(0.82)
  const [format, setFormat] = useState<OutputFormat>('image/jpeg')
  const [processing, setProcessing] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('请上传图片')
        return
      }
      setSourceFile(file)
      setSourcePreview((c) => {
        if (c) URL.revokeObjectURL(c)
        return URL.createObjectURL(file)
      })
      setProcessing(true)
      try {
        const result = await compressImage(file, { maxWidth, quality, format })
        setResultPreview((c) => {
          if (c) URL.revokeObjectURL(c)
          return result.previewUrl
        })
        setResultBlob(result.blob)
        setResultSize(result.blob.size)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : '压缩失败')
      } finally {
        setProcessing(false)
      }
    },
    [format, maxWidth, quality],
  )

  useEffect(() => {
    if (sourceFile) void processFile(sourceFile)
  }, [maxWidth, quality, format]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (sourcePreview) URL.revokeObjectURL(sourcePreview)
      if (resultPreview) URL.revokeObjectURL(resultPreview)
    }
  }, [sourcePreview, resultPreview])

  const toolbar = resultBlob ? (
    <Button variant="secondary" size="sm" onClick={() => {
      if (!sourceFile) return
      const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg'
      const a = document.createElement('a')
      a.href = resultPreview
      a.download = `${sourceFile.name.replace(/\.[^.]+$/, '')}.${ext}`
      a.click()
      toast.success('已下载')
    }}>
      下载
    </Button>
  ) : undefined

  return (
    <ToolLayout title={tool.name} width="wide" toolbar={toolbar}>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <Card padding="md" className="space-y-4 text-sm">
          <label className="block">
            <span className="text-muted">宽度上限</span>
            <input type="range" min={480} max={3840} step={120} value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))} className="mt-2 w-full accent-[var(--color-brand)]" />
            <span className="text-xs text-subtle">{maxWidth}px</span>
          </label>
          <label className="block">
            <span className="text-muted">质量</span>
            <input type="range" min={0.3} max={1} step={0.02} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="mt-2 w-full accent-[var(--color-brand)]" />
            <span className="text-xs text-subtle">{Math.round(quality * 100)}%</span>
          </label>
          <select value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)} className="w-full rounded-lg border border-app bg-surface px-3 py-2 text-sm">
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
            <option value="image/png">PNG</option>
          </select>
        </Card>

        <div className="space-y-4">
          <div
            role="button"
            tabIndex={0}
            className={cn(
              'flex min-h-40 cursor-pointer items-center justify-center rounded-xl border border-dashed border-app bg-[var(--color-border-subtle)] p-6',
            )}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
            }}
          >
            {sourcePreview ? (
              <p className="text-sm text-muted">{sourceFile?.name}</p>
            ) : (
              <p className="text-sm text-muted">点击上传图片</p>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void processFile(f)
            e.target.value = ''
          }} />

          {sourcePreview && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card padding="md">
                <p className="mb-2 text-xs text-muted">原图 · {sourceFile && formatBytes(sourceFile.size)}</p>
                <img src={sourcePreview} alt="原图" className="max-h-72 w-full object-contain" />
              </Card>
              <Card padding="md">
                <p className="mb-2 text-xs text-muted">
                  {processing ? '处理中…' : resultBlob ? `压缩后 · ${formatBytes(resultSize)}` : ' '}
                </p>
                {resultPreview && !processing && (
                  <>
                    <img src={resultPreview} alt="压缩后" className="max-h-72 w-full object-contain" />
                    {sourceFile && (
                      <p className="mt-2 text-xs text-muted">
                        减少 {Math.max(0, Math.round((1 - resultSize / sourceFile.size) * 100))}%
                      </p>
                    )}
                  </>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
