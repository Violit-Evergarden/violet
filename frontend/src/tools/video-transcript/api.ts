export type { ExtractResponse, HealthResponse } from '@shared/types/api'

export async function fetchHealth(): Promise<import('@shared/types/api').HealthResponse> {
  const response = await fetch('/api/health')
  if (!response.ok) {
    throw new Error('无法连接后端服务')
  }
  return response.json()
}

export async function extractTranscript(
  shareText: string,
): Promise<import('@shared/types/api').ExtractResponse> {
  const response = await fetch('/api/tools/video-transcript/extract', {
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
