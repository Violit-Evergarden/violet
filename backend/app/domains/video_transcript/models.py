from pydantic import BaseModel, Field


class ExtractRequest(BaseModel):
    share_text: str = Field(..., min_length=1, description="抖音分享文本或链接")


class ExtractResponse(BaseModel):
    video_id: str
    title: str
    transcript: str
    duration_seconds: float


class TaskCreateResponse(BaseModel):
    task_id: str


class TaskStatusResponse(BaseModel):
    task_id: str
    status: str
    result: ExtractResponse | None = None
    error: str | None = None
