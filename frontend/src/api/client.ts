export interface ExtractResponse {
  video_id: string
  title: string
  transcript: string
  duration_seconds: number
}

export interface HealthResponse {
  status: string
  ffmpeg_available: boolean
  api_key_configured: boolean
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch('/api/health')
  if (!response.ok) {
    throw new Error('无法连接后端服务')
  }
  return response.json()
}

export async function extractTranscript(shareText: string): Promise<ExtractResponse> {
  const response = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ share_text: shareText }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.detail || '提取文案失败')
  }
  return data
}
