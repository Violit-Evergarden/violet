import json
import re
from dataclasses import dataclass

import requests

MOBILE_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) "
        "EdgiOS/121.0.2277.107 Version/17.0 Mobile/15E148 Safari/604.1"
    )
}

VIDEO_PAGE_KEY = "video_(id)/page"
NOTE_PAGE_KEY = "note_(id)/page"


@dataclass
class VideoInfo:
    video_id: str
    title: str
    video_url: str


class LinkParserError(Exception):
    pass


def extract_url(share_text: str) -> str:
    urls = re.findall(
        r"https?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*(),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+",
        share_text,
    )
    if not urls:
        raise LinkParserError("未找到有效的分享链接")
    return urls[0]


def parse_share_text(share_text: str) -> VideoInfo:
    share_url = extract_url(share_text.strip())

    share_response = requests.get(share_url, headers=MOBILE_HEADERS, timeout=30)
    share_response.raise_for_status()

    video_id = share_response.url.split("?")[0].strip("/").split("/")[-1]
    if not video_id:
        raise LinkParserError("无法从链接中解析视频 ID")

    page_url = f"https://www.iesdouyin.com/share/video/{video_id}"
    response = requests.get(page_url, headers=MOBILE_HEADERS, timeout=30)
    response.raise_for_status()

    pattern = re.compile(r"window\._ROUTER_DATA\s*=\s*(.*?)\s*</script>", re.DOTALL)
    match = pattern.search(response.text)
    if not match or not match.group(1):
        raise LinkParserError("从页面解析视频信息失败")

    json_data = json.loads(match.group(1).strip())
    loader_data = json_data.get("loaderData", {})

    if VIDEO_PAGE_KEY in loader_data:
        original_video_info = loader_data[VIDEO_PAGE_KEY]["videoInfoRes"]
    elif NOTE_PAGE_KEY in loader_data:
        original_video_info = loader_data[NOTE_PAGE_KEY]["videoInfoRes"]
    else:
        raise LinkParserError("无法解析视频或图集信息")

    item_list = original_video_info.get("item_list", [])
    if not item_list:
        raise LinkParserError("视频信息为空")

    data = item_list[0]
    url_list = data.get("video", {}).get("play_addr", {}).get("url_list", [])
    if not url_list:
        raise LinkParserError("未找到视频播放地址")

    video_url = url_list[0].replace("playwm", "play")
    title = data.get("desc", "").strip() or f"douyin_{video_id}"
    title = re.sub(r'[\\/:*?"<>|]', "_", title)

    return VideoInfo(video_id=video_id, title=title, video_url=video_url)
