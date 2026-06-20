from fastapi import APIRouter

from app.core.config import settings
from app.domains.video_transcript.services.audio import check_ffmpeg_available
from app.models import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    ffmpeg_available = check_ffmpeg_available()
    api_key_configured = settings.api_key_configured
    status = "ok" if ffmpeg_available and api_key_configured else "degraded"
    return HealthResponse(
        status=status,
        ffmpeg_available=ffmpeg_available,
        api_key_configured=api_key_configured,
    )
