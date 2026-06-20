"""Backward-compatible re-exports."""

from app.domains.video_transcript.pipeline import PipelineError, extract_transcript

__all__ = ["PipelineError", "extract_transcript"]
