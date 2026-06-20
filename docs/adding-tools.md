# 新增工具 SOP

本文说明如何在 Violet37 工具箱中增加一个新工具（自研或外链）。

## 1. 外链工具（零代码）

编辑 [`frontend/src/catalog/tools.ts`](../frontend/src/catalog/tools.ts)：

```typescript
{
  id: 'example',
  name: '示例外链',
  description: '跳转到第三方网站',
  icon: '🔗',
  category: 'links',
  kind: 'external',
  href: 'https://example.com',
  status: 'live',
  tags: ['外链'],
}
```

部署：仅需 `frontend` build 上传，**无需改后端**。

---

## 2. 纯前端工具（如 JSON 格式化）

1. **注册目录**：在 `catalog/tools.ts` 增加 `kind: 'internal'` 条目，`path: '/tools/your-tool'`
2. **实现页面**：`frontend/src/tools/your-tool/index.tsx`
3. **注册路由**：在 `frontend/src/app/router.tsx` 增加 lazy route
4. **构建验证**：`cd frontend && npm run build`

参考：[`frontend/src/tools/json-formatter/`](../frontend/src/tools/json-formatter/)

---

## 3. 需要后端的工具

1. 完成上述前端 1–3 步
2. **后端路由**：`backend/app/routers/your_tool.py`，前缀 `/api/tools/your-tool`
3. **业务逻辑**：`backend/app/domains/your_tool/`（pipeline、services、models）
4. 在 `backend/app/main.py` 中 `include_router`
5. **测试**：`backend/tests/` 增加用例
6. **部署后端**：OrcaTerm `git pull && pip install -r requirements.txt && systemctl restart violet`

参考：[`backend/app/routers/video_transcript.py`](../backend/app/routers/video_transcript.py)

---

## 4. 视频文案提取 API 路径

| 用途 | 推荐路径 | 兼容旧路径 |
|------|---------|-----------|
| 同步提取 | `POST /api/tools/video-transcript/extract` | `POST /api/extract` |
| 异步提取 | `POST /api/tools/video-transcript/extract/async` | `POST /api/extract/async` |
| 任务查询 | `GET /api/tools/video-transcript/tasks/{id}` | `GET /api/tasks/{id}` |

小程序仍使用旧路径，请勿删除 legacy 路由。

---

## 5. 部署 checklist

- [ ] `npm run build` 通过
- [ ] `python -m unittest discover -s backend/tests` 通过
- [ ] 首页能看到新工具卡片
- [ ] 工具页功能正常
- [ ] 生产环境 curl 健康检查通过

详细部署流程见 [tencent-cloud-deploy.md](./tencent-cloud-deploy.md)。
