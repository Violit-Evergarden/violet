export type { AudioTranscriptResponse } from '@shared/types/api'

export async function transcribeAudio(file: File): Promise<import('@shared/types/api').AudioTranscriptResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/tools/audio-transcript/transcribe', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.detail || '音频转写失败')
  }
  return data
}
