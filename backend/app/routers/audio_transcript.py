from fastapi import APIRouter, File, HTTPException, UploadFile

from app.domains.audio_transcript.models import AudioTranscriptResponse
from app.domains.audio_transcript.pipeline import AudioPipelineError, transcribe_uploaded_audio

router = APIRouter(prefix="/api/tools/audio-transcript", tags=["audio-transcript"])


@router.post("/transcribe", response_model=AudioTranscriptResponse)
async def transcribe(file: UploadFile = File(...)) -> AudioTranscriptResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="请上传音频文件")

    content = await file.read()
    try:
        return transcribe_uploaded_audio(content, file.filename)
    except AudioPipelineError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc
