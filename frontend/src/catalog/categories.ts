export type CategoryDefinition = {
  id: string
  name: string
  description: string
}

export const categories: CategoryDefinition[] = [
  { id: 'media', name: '媒体处理', description: '音视频与内容提取' },
  { id: 'text', name: '文本工具', description: '格式化与转换' },
  { id: 'links', name: '精选外链', description: '第三方实用网站' },
  { id: 'content', name: '内容', description: '博客与阅读' },
]

export function getCategoryName(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? id
}
