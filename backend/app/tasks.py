"""Backward-compatible re-exports."""

from app.core.tasks import TaskRecord, TaskStore, task_store
from app.domains.video_transcript.pipeline import extract_transcript

__all__ = ["TaskRecord", "TaskStore", "extract_transcript", "task_store"]
