import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/ToolPageShell'
import { usePageMeta } from '../hooks/usePageMeta'
import { Button } from '../ui/Button'

export function NotFoundPage() {
  usePageMeta('页面不存在')

  return (
    <PageContainer size="md">
      <div className="flex flex-col items-center py-16 text-center">
        <p className="text-7xl font-bold text-brand" aria-hidden>
          404
        </p>
        <h1 className="mt-4 text-xl font-semibold text-[var(--color-text)]">页面不存在</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">
          该工具或页面可能尚未上线。返回首页浏览可用工具。
        </p>
        <Link to="/" className="mt-8">
          <Button>返回首页</Button>
        </Link>
      </div>
    </PageContainer>
  )
}
