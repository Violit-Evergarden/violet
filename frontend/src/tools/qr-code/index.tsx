import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import jsQR from 'jsqr'
import QRCode from 'qrcode'
import { toast } from 'sonner'
import { getToolById } from '../../catalog/tools'
import { ToolLayout } from '../../components/layout/ToolPageShell'
import { usePageMeta } from '../../hooks/usePageMeta'
import { recordToolVisit } from '../../hooks/useRecentTools'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { Input } from '../../ui/Input'
import { Tabs } from '../../ui/Tabs'
import { cn } from '../../lib/cn'

type Mode = 'encode' | 'decode'

const tool = getToolById('qr-code')!

function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

async function decodeQrFromFile(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = objectUrl
    })
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('无法读取图片')
    context.drawImage(image, 0, 0)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const result = jsQR(imageData.data, imageData.width, imageData.height)
    if (!result?.data) throw new Error('未识别到二维码')
    return result.data
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export default function QrCodeTool() {
  usePageMeta(tool.name, tool.description)
  useEffect(() => {
    recordToolVisit(tool.id)
  }, [])

  const [mode, setMode] = useState<Mode>('encode')
  const [urlInput, setUrlInput] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [encodeError, setEncodeError] = useState('')
  const [decodeResult, setDecodeResult] = useState('')
  const [decodeError, setDecodeError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isDecoding, setIsDecoding] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const normalizedUrl = normalizeUrl(urlInput)

  useEffect(() => {
    if (!normalizedUrl) {
      setQrDataUrl('')
      setEncodeError('')
      return
    }
    if (!isValidUrl(normalizedUrl)) {
      setQrDataUrl('')
      setEncodeError('请输入有效的链接')
      return
    }
    let cancelled = false
    QRCode.toDataURL(normalizedUrl, { width: 280, margin: 2, color: { dark: '#1a1a1a', light: '#ffffff' } })
      .then((dataUrl) => {
        if (!cancelled) {
          setQrDataUrl(dataUrl)
          setEncodeError('')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQrDataUrl('')
          setEncodeError('生成失败')
        }
      })
    return () => {
      cancelled = true
    }
  }, [normalizedUrl])

  const handleDecodeFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setDecodeError('请上传图片')
      return
    }
    setPreviewUrl((c) => {
      if (c) URL.revokeObjectURL(c)
      return URL.createObjectURL(file)
    })
    setIsDecoding(true)
    setDecodeError('')
    setDecodeResult('')
    try {
      setDecodeResult(await decodeQrFromFile(file))
    } catch (e) {
      setDecodeError(e instanceof Error ? e.message : '识别失败')
    } finally {
      setIsDecoding(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const toolbar = (
    <Tabs
      value={mode}
      onChange={setMode}
      options={[
        { value: 'encode', label: '生成' },
        { value: 'decode', label: '识别' },
      ]}
    />
  )

  return (
    <ToolLayout title={tool.name} width="wide" toolbar={toolbar}>
      {mode === 'encode' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card padding="md">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
              invalid={Boolean(encodeError)}
            />
            {encodeError && <Alert variant="error" className="mt-3">{encodeError}</Alert>}
          </Card>
          <Card padding="md" className="flex min-h-64 flex-col items-center justify-center">
            {qrDataUrl ? (
              <>
                <img src={qrDataUrl} alt="二维码" className="h-52 w-52 rounded-lg bg-white p-2" />
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    const a = document.createElement('a')
                    a.href = qrDataUrl
                    a.download = 'qrcode.png'
                    a.click()
                    toast.success('已下载')
                  }}
                >
                  <Download className="h-4 w-4" aria-hidden />
                  下载
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted">输入链接后自动生成</p>
            )}
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card padding="md">
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault()
                const f = e.dataTransfer.files?.[0]
                if (f) void handleDecodeFile(f)
              }}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                'flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-app bg-[var(--color-border-subtle)] p-6',
                'hover:border-[var(--color-brand)]',
              )}
            >
              <Upload className="mb-2 h-6 w-6 text-brand" aria-hidden />
              <p className="text-sm">上传二维码图片</p>
              {previewUrl && <img src={previewUrl} alt="" className="mt-4 max-h-36 object-contain" />}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void handleDecodeFile(f)
              e.target.value = ''
            }} />
          </Card>
          <Card padding="md">
            {isDecoding ? (
              <p className="text-sm text-muted">识别中…</p>
            ) : decodeError ? (
              <Alert variant="error">{decodeError}</Alert>
            ) : decodeResult ? (
              <div className="space-y-3">
                <pre className="overflow-auto rounded-lg bg-[var(--color-border-subtle)] p-3 text-sm break-all whitespace-pre-wrap">
                  {decodeResult}
                </pre>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={async () => {
                    await navigator.clipboard.writeText(decodeResult)
                    toast.success('已复制')
                  }}>
                    复制
                  </Button>
                  {isValidUrl(decodeResult) && (
                    <Button size="sm" onClick={() => window.open(decodeResult, '_blank', 'noopener,noreferrer')}>
                      打开
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">识别结果</p>
            )}
          </Card>
        </div>
      )}
    </ToolLayout>
  )
}
