# 抖音视频文案提取

粘贴抖音分享文本，自动解析视频链接、下载视频、提取音频，并通过语音识别将口播内容转为文字。

## 功能

- 支持粘贴完整分享文本（自动提取 `v.douyin.com` 短链）
- 获取无水印视频并提取音频
- 使用硅基流动 SenseVoice 进行中文语音识别
- Web 界面展示结果，支持一键复制

## 环境要求

- Python 3.11+
- Node.js 18+
- [ffmpeg](https://ffmpeg.org/)（音频提取）
- [硅基流动 API Key](https://cloud.siliconflow.cn/)（语音识别）

## 快速开始

### 1. 安装 ffmpeg

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg
```

### 2. 后端

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# 编辑 .env，填入 SILICONFLOW_API_KEY
uvicorn app.main:app --reload --port 8000
```

### 3. 前端（开发模式）

```bash
cd frontend
npm install
npm run dev
```

浏览器访问 `http://localhost:5173`。

### 4. 生产部署（单端口）

```bash
cd frontend && npm run build
cd ../backend && source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

访问 `http://localhost:8000`。

## API

### `GET /api/health`

检查 ffmpeg 与 API Key 配置状态。

### `POST /api/extract`

```json
{
  "share_text": "9.20 :4pm ... https://v.douyin.com/OBrtQhfNGFU/ ..."
}
```

响应：

```json
{
  "video_id": "7636717753054891300",
  "title": "视频标题",
  "transcript": "识别出的语音文字",
  "duration_seconds": 120.5
}
```

## 项目结构

```
video_to_text/
├── backend/          # FastAPI 后端
├── frontend/         # React + Vite 前端
└── README.md
```

## 注意事项

- 抖音页面结构可能变更，解析失败时请检查链接是否有效
- 长视频会自动分段识别后合并
- 语音识别依赖硅基流动 API，请确保账户有足够额度
