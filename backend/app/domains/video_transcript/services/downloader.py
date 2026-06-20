from pathlib import Path

import requests

from app.domains.video_transcript.services.link_parser import MOBILE_HEADERS, VideoInfo


class DownloadError(Exception):
    pass


def download_video(video_info: VideoInfo, output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    filepath = output_dir / f"{video_info.video_id}.mp4"

    try:
        response = requests.get(
            video_info.video_url,
            headers=MOBILE_HEADERS,
            stream=True,
            timeout=120,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise DownloadError(f"视频下载失败: {exc}") from exc

    with open(filepath, "wb") as file:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                file.write(chunk)

    if filepath.stat().st_size == 0:
        filepath.unlink(missing_ok=True)
        raise DownloadError("下载的视频文件为空")

    return filepath
