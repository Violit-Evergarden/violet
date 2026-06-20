from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.models import ExtractRequest, ExtractResponse, HealthResponse
from app.pipeline import PipelineError, extract_transcript
from app.services.audio import check_ffmpeg_available

app = FastAPI(title="抖音视频文案提取", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    ffmpeg_available = check_ffmpeg_available()
    api_key_configured = settings.api_key_configured
    status = "ok" if ffmpeg_available and api_key_configured else "degraded"
    return HealthResponse(
        status=status,
        ffmpeg_available=ffmpeg_available,
        api_key_configured=api_key_configured,
    )


@app.post("/api/extract", response_model=ExtractResponse)
def extract(request: ExtractRequest) -> ExtractResponse:
    try:
        return extract_transcript(request.share_text)
    except PipelineError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc


frontend_dist = Path(__file__).resolve().parents[2] / "frontend" / "dist"
if frontend_dist.exists():
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not Found")

        requested = frontend_dist / full_path
        if full_path and requested.is_file():
            return FileResponse(requested)
        return FileResponse(frontend_dist / "index.html")
