import shutil
import tempfile
from pathlib import Path

from app.core.config import settings
from app.domains.audio_transcript.models import AudioTranscriptResponse
from app.domains.video_transcript.services.audio import (
    AudioError,
    check_ffmpeg_available,
    convert_to_mp3,
    get_audio_info,
)
from app.domains.video_transcript.services.transcriber import (
    SenseVoiceTranscriber,
    TranscriberError,
)

MAX_UPLOAD_BYTES = 50 * 1024 * 1024
ALLOWED_SUFFIXES = {".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac", ".webm", ".mp4", ".mpeg", ".mpga"}


class AudioPipelineError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.status_code = status_code


def transcribe_uploaded_audio(content: bytes, filename: str) -> AudioTranscriptResponse:
    if not check_ffmpeg_available():
        raise AudioPipelineError("未找到 ffmpeg，请先安装 ffmpeg", status_code=503)

    if not settings.api_key_configured:
        raise AudioPipelineError("未配置 SILICONFLOW_API_KEY", status_code=503)

    if len(content) == 0:
        raise AudioPipelineError("音频文件为空", status_code=400)

    if len(content) > MAX_UPLOAD_BYTES:
        raise AudioPipelineError("音频文件不能超过 50MB", status_code=400)

    suffix = Path(filename).suffix.lower()
    if suffix not in ALLOWED_SUFFIXES:
        allowed = "、".join(sorted(ALLOWED_SUFFIXES))
        raise AudioPipelineError(f"不支持的音频格式，请上传 {allowed}", status_code=400)

    settings.temp_dir.mkdir(parents=True, exist_ok=True)
    temp_dir = Path(tempfile.mkdtemp(prefix="jiban_audio_", dir=settings.temp_dir))

    try:
        source_path = temp_dir / f"upload{suffix}"
        source_path.write_bytes(content)

        try:
            if suffix == ".mp3":
                audio_path = source_path
            else:
                audio_path = convert_to_mp3(source_path, temp_dir / "audio.mp3")
            duration_seconds = get_audio_info(audio_path)["duration"]
        except AudioError as exc:
            raise AudioPipelineError(str(exc), status_code=503) from exc

        try:
            transcriber = SenseVoiceTranscriber(temp_dir=temp_dir)
            transcript = transcriber.transcribe(audio_path)
        except TranscriberError as exc:
            raise AudioPipelineError(str(exc), status_code=503) from exc

        return AudioTranscriptResponse(
            filename=Path(filename).name,
            transcript=transcript,
            duration_seconds=duration_seconds,
        )
    finally:
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)
