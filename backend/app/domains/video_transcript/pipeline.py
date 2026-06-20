import shutil
import tempfile
from pathlib import Path

from app.core.config import settings
from app.domains.video_transcript.models import ExtractResponse
from app.domains.video_transcript.services.audio import (
    AudioError,
    check_ffmpeg_available,
    extract_audio,
    get_audio_info,
)
from app.domains.video_transcript.services.downloader import DownloadError, download_video
from app.domains.video_transcript.services.link_parser import LinkParserError, parse_share_text
from app.domains.video_transcript.services.transcriber import (
    SenseVoiceTranscriber,
    TranscriberError,
)


class PipelineError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.status_code = status_code


def extract_transcript(share_text: str) -> ExtractResponse:
    if not check_ffmpeg_available():
        raise PipelineError("未找到 ffmpeg，请先安装 ffmpeg", status_code=503)

    if not settings.api_key_configured:
        raise PipelineError("未配置 SILICONFLOW_API_KEY", status_code=503)

    try:
        video_info = parse_share_text(share_text)
    except LinkParserError as exc:
        raise PipelineError(str(exc), status_code=400) from exc

    settings.temp_dir.mkdir(parents=True, exist_ok=True)
    temp_dir = Path(tempfile.mkdtemp(prefix="violet_", dir=settings.temp_dir))

    try:
        try:
            video_path = download_video(video_info, temp_dir)
        except DownloadError as exc:
            raise PipelineError(str(exc), status_code=502) from exc

        try:
            audio_path = extract_audio(video_path)
            duration_seconds = get_audio_info(audio_path)["duration"]
        except AudioError as exc:
            raise PipelineError(str(exc), status_code=503) from exc

        try:
            transcriber = SenseVoiceTranscriber(temp_dir=temp_dir)
            transcript = transcriber.transcribe(audio_path)
        except TranscriberError as exc:
            raise PipelineError(str(exc), status_code=503) from exc

        return ExtractResponse(
            video_id=video_info.video_id,
            title=video_info.title,
            transcript=transcript,
            duration_seconds=duration_seconds,
        )
    finally:
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)
