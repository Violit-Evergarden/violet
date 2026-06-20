import shutil
import subprocess
from pathlib import Path


class AudioError(Exception):
    pass


def check_ffmpeg_available() -> bool:
    return shutil.which("ffmpeg") is not None and shutil.which("ffprobe") is not None


def _run_ffmpeg(args: list[str]) -> None:
    try:
        subprocess.run(
            ["ffmpeg", *args],
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        stderr = exc.stderr.strip() if exc.stderr else str(exc)
        raise AudioError(f"FFmpeg 执行失败: {stderr}") from exc
    except FileNotFoundError as exc:
        raise AudioError("未找到 ffmpeg，请先安装 ffmpeg") from exc


def extract_audio(video_path: Path) -> Path:
    audio_path = video_path.with_suffix(".mp3")
    _run_ffmpeg(
        [
            "-y",
            "-i",
            str(video_path),
            "-vn",
            "-acodec",
            "libmp3lame",
            "-q:a",
            "2",
            str(audio_path),
        ]
    )
    return audio_path


def get_audio_info(audio_path: Path) -> dict:
    if not check_ffmpeg_available():
        raise AudioError("未找到 ffprobe，请先安装 ffmpeg")

    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration,size",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(audio_path),
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        lines = [line.strip() for line in result.stdout.splitlines() if line.strip()]
        duration = float(lines[0]) if lines else 0.0
        size = int(float(lines[1])) if len(lines) > 1 else audio_path.stat().st_size
        return {"duration": duration, "size": size}
    except (subprocess.CalledProcessError, ValueError, IndexError):
        return {"duration": 0.0, "size": audio_path.stat().st_size}


def split_audio(
    audio_path: Path,
    output_dir: Path,
    segment_duration: int = 540,
) -> list[Path]:
    audio_info = get_audio_info(audio_path)
    duration = audio_info["duration"]

    if duration <= segment_duration:
        return [audio_path]

    output_dir.mkdir(parents=True, exist_ok=True)
    segments: list[Path] = []
    current_time = 0.0
    segment_index = 0

    while current_time < duration:
        segment_path = output_dir / f"segment_{segment_index}.mp3"
        _run_ffmpeg(
            [
                "-y",
                "-i",
                str(audio_path),
                "-ss",
                str(current_time),
                "-t",
                str(segment_duration),
                "-acodec",
                "libmp3lame",
                "-q:a",
                "2",
                str(segment_path),
            ]
        )
        segments.append(segment_path)
        current_time += segment_duration
        segment_index += 1

    return segments
