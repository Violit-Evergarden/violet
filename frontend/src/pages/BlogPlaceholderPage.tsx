import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { PageContainer } from '../components/layout/ToolPageShell'
import { usePageMeta } from '../hooks/usePageMeta'
import { Button } from '../ui/Button'

export function BlogPlaceholderPage() {
  usePageMeta('个人博客', '技术笔记与生活随笔，筹备中。')

  return (
    <PageContainer size="md">
      <div className="relative overflow-hidden rounded-3xl border border-app bg-surface p-10 text-center shadow-sm">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--color-brand-muted)] opacity-80"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-[var(--color-brand-muted)] opacity-60"
          aria-hidden
        />
        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand-muted)] text-brand">
          <BookOpen className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="relative mt-6 text-2xl font-bold text-[var(--color-text)]">个人博客</h1>
        <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
          博客模块正在建设中。后续将支持 Markdown / MDX 文章，与几案同站部署，便于阅读与检索。
        </p>
        <Link to="/" className="relative mt-8 inline-block">
          <Button variant="secondary">返回首页</Button>
        </Link>
      </div>
    </PageContainer>
  )
}
