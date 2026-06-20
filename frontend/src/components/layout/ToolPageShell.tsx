import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

export function PageContainer({
  children,
  className,
  size = 'lg',
}: {
  children: React.ReactNode
  className?: string
  size?: 'md' | 'lg' | 'xl'
}) {
  const max = { md: 'max-w-3xl', lg: 'max-w-5xl', xl: 'max-w-6xl' }[size]
  return <div className={cn('mx-auto w-full px-4 py-8 sm:py-10', max, className)}>{children}</div>
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-app bg-surface px-6 py-16 text-center">
      <div className="mb-4 h-12 w-12 rounded-xl bg-[var(--color-brand-muted)]" aria-hidden />
      <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

type ToolLayoutProps = {
  title: string
  width?: 'default' | 'wide'
  toolbar?: React.ReactNode
  children: React.ReactNode
}

const widthClass = {
  default: 'max-w-4xl',
  wide: 'max-w-7xl',
}

/** 工具页统一壳：顶栏 + 内容区，无侧栏 */
export function ToolLayout({ title, width = 'default', toolbar, children }: ToolLayoutProps) {
  return (
    <div className={cn('mx-auto w-full px-4 py-4 sm:px-6 sm:py-5', widthClass[width])}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="工具导航" className="flex min-w-0 items-center gap-2 text-sm">
          <Link to="/#tools" className="shrink-0 text-muted transition hover:text-brand">
            工具
          </Link>
          <span className="text-subtle" aria-hidden>
            /
          </span>
          <h1 className="truncate font-medium text-[var(--color-text)]">{title}</h1>
        </nav>
        {toolbar ? <div className="flex flex-wrap items-center gap-2">{toolbar}</div> : null}
      </div>
      {children}
    </div>
  )
}

type ToolSplitPaneProps = {
  leftLabel: string
  rightLabel: string
  left: React.ReactNode
  right: React.ReactNode
  className?: string
}

/** 双栏工作台：占满视口高度，适合编辑器类工具 */
export function ToolSplitPane({ leftLabel, rightLabel, left, right, className }: ToolSplitPaneProps) {
  return (
    <div
      className={cn(
        'flex min-h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-xl border border-app bg-surface shadow-sm',
        'lg:grid lg:grid-cols-2 lg:divide-x lg:divide-[var(--color-border)]',
        className,
      )}
    >
      <section className="flex min-h-0 min-h-[40dvh] flex-1 flex-col lg:min-h-0">
        <header className="shrink-0 border-b border-app px-4 py-2 text-xs font-medium text-subtle">
          {leftLabel}
        </header>
        <div className="min-h-0 flex-1">{left}</div>
      </section>
      <section className="flex min-h-0 min-h-[40dvh] flex-1 flex-col border-t border-app lg:border-t-0">
        <header className="shrink-0 border-b border-app px-4 py-2 text-xs font-medium text-subtle">
          {rightLabel}
        </header>
        <div className="min-h-0 flex-1 overflow-auto">{right}</div>
      </section>
    </div>
  )
}

export const splitPaneInputClass =
  'h-full min-h-[38dvh] w-full resize-none rounded-none border-0 bg-transparent px-4 py-3 font-mono text-sm leading-6 text-[var(--color-text)] placeholder:text-subtle focus:ring-0 focus:outline-none lg:min-h-0'

export const splitPaneOutputClass =
  'h-full min-h-[38dvh] w-full overflow-auto px-4 py-3 font-mono text-sm leading-6 whitespace-pre-wrap break-all text-[var(--color-text)] lg:min-h-0'

/** @deprecated 使用 ToolLayout */
export const ToolPageShell = ToolLayout
