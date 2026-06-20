export type CategoryDefinition = {
  id: string
  name: string
  description: string
}

export const categories: CategoryDefinition[] = [
  { id: 'media', name: '媒体', description: '音视频提取与处理' },
  { id: 'text', name: '文本', description: '格式化、校验与转换' },
  { id: 'image', name: '图像与码', description: '二维码与图像相关' },
  { id: 'dev', name: '开发', description: '编码、调试与开发辅助' },
]

export function getCategoryName(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? id
}
