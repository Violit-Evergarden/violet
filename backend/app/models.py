"""Backward-compatible re-exports."""

from app.domains.video_transcript.models import (
    ExtractRequest,
    ExtractResponse,
    TaskCreateResponse,
    TaskStatusResponse,
)
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    ffmpeg_available: bool
    api_key_configured: bool


__all__ = [
    "ExtractRequest",
    "ExtractResponse",
    "HealthResponse",
    "TaskCreateResponse",
    "TaskStatusResponse",
]
