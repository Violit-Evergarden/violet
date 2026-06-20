import { Outlet } from 'react-router-dom'
import { SiteHeader } from '../components/SiteHeader'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Violet37 在线工具箱 · 自研工具与精选外链
      </footer>
    </div>
  )
}
