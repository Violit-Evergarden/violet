import { Link, NavLink } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../app/ThemeProvider'
import { SITE_NAME } from '../config/site'
import { cn } from '../lib/cn'
import { Button } from '../ui/Button'

const navItems = [
  { to: '/', label: '工作台', end: true },
  { to: '/#tools', label: '全部工具', end: false },
]

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 border-b border-app bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="group flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand)] text-base font-semibold text-white"
            aria-hidden
          >
            几
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)] group-hover:text-brand transition">
              {SITE_NAME}
            </p>
            <p className="text-xs text-subtle">在线工具</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1" aria-label="主导航">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-[var(--color-brand-muted)] text-brand'
                    : 'text-muted hover:text-[var(--color-text)]',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          className="!px-2.5"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}
