import { Link, useLocation } from 'react-router-dom'

export function SiteHeader() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-lg">
            🧰
          </span>
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-sky-300">Violet37</p>
            <p className="text-xs text-slate-500">在线工具箱</p>
          </div>
        </Link>
        {!isHome && (
          <Link
            to="/"
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-sky-500 hover:text-sky-300"
          >
            返回首页
          </Link>
        )}
      </div>
    </header>
  )
}
