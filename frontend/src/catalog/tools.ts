import type { LucideIcon } from 'lucide-react'
import {
  Binary,
  Braces,
  Clock,
  FileText,
  Film,
  GitCompare,
  ImageDown,
  Link2,
  Mic,
  QrCode,
} from 'lucide-react'

export const toolIcons = {
  Film,
  Mic,
  Braces,
  GitCompare,
  FileText,
  Link2,
  QrCode,
  Clock,
  Binary,
  ImageDown,
} as const satisfies Record<string, LucideIcon>

export type ToolIconName = keyof typeof toolIcons

export type ToolDefinition = {
  id: string
  name: string
  description: string
  icon: ToolIconName
  category: string
  kind: 'internal'
  path: string
  status?: 'live' | 'beta' | 'soon'
  tags?: string[]
}

export const tools: ToolDefinition[] = [
  {
    id: 'video-transcript',
    name: '视频文案提取',
    description: '粘贴抖音分享文本，自动识别视频语音并转为文字。',
    icon: 'Film',
    category: 'media',
    kind: 'internal',
    path: '/tools/video-transcript',
    status: 'live',
    tags: ['抖音', '语音识别'],
  },
  {
    id: 'audio-transcript',
    name: '音频转文字',
    description: '上传 mp3、wav 等音频，自动语音识别并输出文本。',
    icon: 'Mic',
    category: 'media',
    kind: 'internal',
    path: '/tools/audio-transcript',
    status: 'live',
    tags: ['语音识别', 'ASR'],
  },
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '校验、美化或压缩 JSON，支持一键复制。',
    icon: 'Braces',
    category: 'text',
    kind: 'internal',
    path: '/tools/json-formatter',
    status: 'live',
    tags: ['JSON', '格式化'],
  },
  {
    id: 'text-diff',
    name: '文本对比',
    description: '对比两段文本差异，高亮增删内容。',
    icon: 'GitCompare',
    category: 'text',
    kind: 'internal',
    path: '/tools/text-diff',
    status: 'live',
    tags: ['Diff', '对比'],
  },
  {
    id: 'url-codec',
    name: 'URL 编解码',
    description: 'URL 组件编码/解码，解析查询参数。',
    icon: 'Link2',
    category: 'text',
    kind: 'internal',
    path: '/tools/url-codec',
    status: 'live',
    tags: ['URL', '编码'],
  },
  {
    id: 'markdown-preview',
    name: 'Markdown 预览',
    description: '实时渲染 Markdown，支持 GFM 语法。',
    icon: 'FileText',
    category: 'text',
    kind: 'internal',
    path: '/tools/markdown-preview',
    status: 'live',
    tags: ['Markdown', '预览'],
  },
  {
    id: 'qr-code',
    name: '二维码工具',
    description: '链接生成二维码，或从图片识别 URL。',
    icon: 'QrCode',
    category: 'image',
    kind: 'internal',
    path: '/tools/qr-code',
    status: 'live',
    tags: ['二维码', 'URL'],
  },
  {
    id: 'image-compress',
    name: '图片压缩',
    description: '调整质量与尺寸，导出 JPEG / WebP / PNG。',
    icon: 'ImageDown',
    category: 'image',
    kind: 'internal',
    path: '/tools/image-compress',
    status: 'live',
    tags: ['图片', '压缩'],
  },
  {
    id: 'timestamp',
    name: '时间戳转换',
    description: 'Unix 时间戳与日期互转，支持秒/毫秒。',
    icon: 'Clock',
    category: 'dev',
    kind: 'internal',
    path: '/tools/timestamp',
    status: 'live',
    tags: ['Unix', '时间'],
  },
  {
    id: 'base64',
    name: 'Base64 编解码',
    description: '文本 Base64 编码与解码，支持 Unicode。',
    icon: 'Binary',
    category: 'dev',
    kind: 'internal',
    path: '/tools/base64',
    status: 'live',
    tags: ['Base64', '编码'],
  },
]

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((t) => t.id === id)
}

export function getInternalTools() {
  return tools.filter((t) => t.kind === 'internal' && t.status !== 'soon')
}

export function getLiveTools() {
  return getInternalTools()
}
