from pathlib import Path
from typing import Protocol

import requests

from app.core.config import settings
from app.domains.video_transcript.services.audio import get_audio_info, split_audio


class TranscriberError(Exception):
    pass


class Transcriber(Protocol):
    def transcribe(self, audio_path: Path) -> str: ...


class SenseVoiceTranscriber:
    def __init__(
        self,
        api_key: str | None = None,
        api_base_url: str | None = None,
        model: str | None = None,
        temp_dir: Path | None = None,
    ):
        self.api_key = api_key or settings.siliconflow_api_key
        self.api_base_url = api_base_url or settings.siliconflow_api_base_url
        self.model = model or settings.asr_model
        self.temp_dir = temp_dir or settings.temp_dir

        if not self.api_key or self.api_key == "sk-xxx":
            raise TranscriberError("未配置 SILICONFLOW_API_KEY")

    def transcribe(self, audio_path: Path) -> str:
        audio_info = get_audio_info(audio_path)
        max_duration = 3600
        max_size = 50 * 1024 * 1024

        need_split = audio_info["duration"] > max_duration or audio_info["size"] > max_size
        if not need_split:
            return self._transcribe_single(audio_path)

        segments = split_audio(audio_path, self.temp_dir / "segments")
        texts: list[str] = []
        for segment_path in segments:
            texts.append(self._transcribe_single(segment_path))
            if segment_path != audio_path and segment_path.exists():
                segment_path.unlink()

        return "".join(texts)

    def _transcribe_single(self, audio_path: Path) -> str:
        headers = {"Authorization": f"Bearer {self.api_key}"}
        with open(audio_path, "rb") as audio_file:
            files = {
                "file": (audio_path.name, audio_file, "audio/mpeg"),
                "model": (None, self.model),
            }
            try:
                response = requests.post(
                    self.api_base_url,
                    files=files,
                    headers=headers,
                    timeout=300,
                )
                response.raise_for_status()
            except requests.RequestException as exc:
                raise TranscriberError(f"语音识别失败: {exc}") from exc

        try:
            result = response.json()
        except ValueError as exc:
            raise TranscriberError("语音识别返回格式异常") from exc

        if isinstance(result, dict) and "text" in result:
            return str(result["text"])
        return response.text
