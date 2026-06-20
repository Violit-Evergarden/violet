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

export interface TaskCreateResponse {
  task_id: string
}

export interface TaskStatusResponse {
  task_id: string
  status: string
  result: ExtractResponse | null
  error: string | null
}

export interface AudioTranscriptResponse {
  filename: string
  transcript: string
  duration_seconds: number
}
