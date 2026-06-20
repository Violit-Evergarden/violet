from pydantic import BaseModel, Field


class ExtractRequest(BaseModel):
    share_text: str = Field(..., min_length=1, description="抖音分享文本或链接")


class ExtractResponse(BaseModel):
    video_id: str
    title: str
    transcript: str
    duration_seconds: float


class HealthResponse(BaseModel):
    status: str
    ffmpeg_available: bool
    api_key_configured: bool
