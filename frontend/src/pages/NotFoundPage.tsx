import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-6xl">404</p>
      <h1 className="text-xl font-semibold text-white">页面不存在</h1>
      <p className="text-sm text-slate-400">该工具或页面可能尚未上线，请返回首页浏览可用工具。</p>
      <Link to="/">
        <Button>返回首页</Button>
      </Link>
    </div>
  )
}
