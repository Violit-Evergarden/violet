from pydantic import BaseModel


class AudioTranscriptResponse(BaseModel):
    filename: str
    transcript: str
    duration_seconds: float
