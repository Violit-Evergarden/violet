from fastapi import APIRouter, HTTPException

from app.core.tasks import task_store
from app.domains.video_transcript.models import (
    ExtractRequest,
    ExtractResponse,
    TaskCreateResponse,
    TaskStatusResponse,
)
from app.domains.video_transcript.pipeline import PipelineError, extract_transcript

router = APIRouter(prefix="/api/tools/video-transcript", tags=["video-transcript"])


@router.post("/extract", response_model=ExtractResponse)
def extract(request: ExtractRequest) -> ExtractResponse:
    try:
        return extract_transcript(request.share_text)
    except PipelineError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc


@router.post("/extract/async", response_model=TaskCreateResponse)
def extract_async(request: ExtractRequest) -> TaskCreateResponse:
    task_id = task_store.create(request.share_text)
    return TaskCreateResponse(task_id=task_id)


@router.get("/tasks/{task_id}", response_model=TaskStatusResponse)
def get_task(task_id: str) -> TaskStatusResponse:
    record = task_store.get(task_id)
    if not record:
        raise HTTPException(status_code=404, detail="任务不存在")

    return TaskStatusResponse(
        task_id=record.task_id,
        status=record.status,
        result=record.result,
        error=record.error,
    )


legacy_router = APIRouter(tags=["video-transcript-legacy"])


@legacy_router.post("/api/extract", response_model=ExtractResponse)
def legacy_extract(request: ExtractRequest) -> ExtractResponse:
    return extract(request)


@legacy_router.post("/api/extract/async", response_model=TaskCreateResponse)
def legacy_extract_async(request: ExtractRequest) -> TaskCreateResponse:
    return extract_async(request)


@legacy_router.get("/api/tasks/{task_id}", response_model=TaskStatusResponse)
def legacy_get_task(task_id: str) -> TaskStatusResponse:
    return get_task(task_id)
