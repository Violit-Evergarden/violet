export type ToolDefinition = {
  id: string
  name: string
  description: string
  icon: string
  category: string
  kind: 'internal' | 'external'
  path?: string
  href?: string
  featured?: boolean
  status?: 'live' | 'beta' | 'soon'
  tags?: string[]
}

export const tools: ToolDefinition[] = [
  {
    id: 'video-transcript',
    name: '视频文案提取',
    description: '粘贴抖音分享文本，自动识别视频语音并转为文字。',
    icon: '🎬',
    category: 'media',
    kind: 'internal',
    path: '/tools/video-transcript',
    featured: true,
    status: 'live',
    tags: ['抖音', '语音识别', 'ASR'],
  },
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '校验、美化或压缩 JSON，支持一键复制结果。',
    icon: '{ }',
    category: 'text',
    kind: 'internal',
    path: '/tools/json-formatter',
    featured: true,
    status: 'live',
    tags: ['JSON', '格式化'],
  },
  {
    id: 'blog',
    name: '个人博客',
    description: '技术笔记与生活随笔，建设中。',
    icon: '📝',
    category: 'content',
    kind: 'internal',
    path: '/blog',
    status: 'beta',
    tags: ['博客'],
  },
  {
    id: 'github',
    name: 'GitHub',
    description: '开源项目与代码仓库。',
    icon: '🐙',
    category: 'links',
    kind: 'external',
    href: 'https://github.com/Violit-Evergarden',
    status: 'live',
    tags: ['开源'],
  },
]

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((t) => t.id === id)
}
