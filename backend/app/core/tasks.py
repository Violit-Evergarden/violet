import threading
import uuid
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Literal

from app.domains.video_transcript.models import ExtractResponse
from app.domains.video_transcript.pipeline import PipelineError, extract_transcript

TaskStatus = Literal["pending", "processing", "done", "failed"]


@dataclass
class TaskRecord:
    task_id: str
    status: TaskStatus = "pending"
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    result: ExtractResponse | None = None
    error: str | None = None


class TaskStore:
    def __init__(self) -> None:
        self._tasks: dict[str, TaskRecord] = {}
        self._lock = threading.Lock()

    def create(self, share_text: str) -> str:
        task_id = uuid.uuid4().hex
        record = TaskRecord(task_id=task_id)
        with self._lock:
            self._tasks[task_id] = record

        thread = threading.Thread(
            target=self._run_task,
            args=(task_id, share_text),
            daemon=True,
        )
        thread.start()
        return task_id

    def get(self, task_id: str) -> TaskRecord | None:
        with self._lock:
            return self._tasks.get(task_id)

    def _run_task(self, task_id: str, share_text: str) -> None:
        self._update(task_id, status="processing")
        try:
            result = extract_transcript(share_text)
        except PipelineError as exc:
            self._update(task_id, status="failed", error=str(exc))
            return
        except Exception as exc:  # noqa: BLE001
            self._update(task_id, status="failed", error=str(exc))
            return

        self._update(task_id, status="done", result=result)

    def _update(
        self,
        task_id: str,
        *,
        status: TaskStatus | None = None,
        result: ExtractResponse | None = None,
        error: str | None = None,
    ) -> None:
        with self._lock:
            record = self._tasks.get(task_id)
            if not record:
                return
            if status is not None:
                record.status = status
            if result is not None:
                record.result = result
            if error is not None:
                record.error = error
            record.updated_at = datetime.now(UTC)


task_store = TaskStore()

# Alias for test patches: app.core.tasks.extract_transcript
__all__ = ["TaskRecord", "TaskStore", "TaskStatus", "extract_transcript", "task_store"]
