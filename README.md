# Violet37 在线工具箱

Web 工具集合站点，首页展示多个工具入口。当前内置 **视频文案提取**、**JSON 格式化** 等；更多工具与博客持续扩展中。

## 功能

### 视频文案提取

- 支持粘贴完整分享文本（自动提取 `v.douyin.com` 短链）
- 获取无水印视频并提取音频
- 使用硅基流动 SenseVoice 进行中文语音识别
- Web 界面展示结果，支持一键复制

### 工具箱

- 配置驱动的工具目录（自研 + 外链）
- 每个工具独立页面，按需懒加载
- 新增工具见 [docs/adding-tools.md](docs/adding-tools.md)

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

### 4. 生产部署（Web 子域名 + API 分离）

线上推荐：

- **Web 站点**：`https://www.violet37.cn`（Nginx 静态文件 + `/api` 反代）
- **API**：`https://api.violet37.cn`（小程序、独立调用）

部署步骤见 [docs/tencent-cloud-deploy.md](docs/tencent-cloud-deploy.md) 阶段 5.5。

本地单端口联调（前后端同域）：

```bash
cd frontend && npm run build
cd ../backend && source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

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

### `POST /api/extract/async`

创建异步提取任务（推荐小程序使用）。

```json
{"share_text": "..."}
```

响应：`{"task_id": "..."}`

### `GET /api/tasks/{task_id}`

查询任务状态，`status` 为 `pending` | `processing` | `done` | `failed`。

## 项目结构

```
violet/
├── backend/              # FastAPI API（按工具域模块化）
├── frontend/             # React + Vite 工具箱 Web
├── miniprogram/          # 微信小程序（单工具）
├── shared/types/         # 前后端共享 API 类型
├── docs/adding-tools.md # 新增工具 SOP
└── README.md
```

## 微信小程序

小程序源码位于 `miniprogram/`，通过异步任务 API 调用后端，避免微信请求超时。

详细发布步骤见 [docs/miniprogram-deploy.md](docs/miniprogram-deploy.md)。腾讯云域名、服务器、备案与后端部署见 [docs/tencent-cloud-deploy.md](docs/tencent-cloud-deploy.md)。

快速开始：

1. 在微信开发者工具中导入本项目根目录
2. 修改 `miniprogram/utils/config.js` 中的 `API_BASE_URL`
3. 填写 AppID（`project.private.config.json`）
4. 开发阶段勾选「不校验合法域名」进行本地调试

## 注意事项

- 抖音页面结构可能变更，解析失败时请检查链接是否有效
- 长视频会自动分段识别后合并
- 语音识别依赖硅基流动 API，请确保账户有足够额度
