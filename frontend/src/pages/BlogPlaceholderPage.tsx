import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function BlogPlaceholderPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Blog</p>
      <h1 className="text-3xl font-bold text-white">个人博客</h1>
      <p className="leading-7 text-slate-400">
        博客模块正在建设中。后续将支持 Markdown / MDX 文章，与工具箱同站部署，便于 SEO 与阅读体验。
      </p>
      <Link to="/">
        <Button variant="secondary">返回工具箱</Button>
      </Link>
    </div>
  )
}
