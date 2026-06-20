import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, getCategoryName } from '../catalog/categories'
import { getInternalTools } from '../catalog/tools'
import { ToolGrid } from '../components/ToolGrid'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '../config/site'
import { usePageMeta } from '../hooks/usePageMeta'
import { useRecentTools } from '../hooks/useRecentTools'
import { Chip } from '../ui/Chip'
import { EmptyState } from '../components/layout/ToolPageShell'
import { PageContainer } from '../components/layout/ToolPageShell'
import { SearchInput } from '../ui/Input'
import { ToolCard } from '../components/ToolCard'

export function HomePage() {
  usePageMeta(SITE_NAME, SITE_DESCRIPTION)

  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const searchRef = useRef<HTMLInputElement>(null)
  const recentTools = useRecentTools()
  const liveTools = getInternalTools()

  const gridTools = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return liveTools.filter((tool) => {
      const matchCategory = activeCategory === 'all' || tool.category === activeCategory
      if (!matchCategory) return false
      if (!normalized) return true
      const haystack = [tool.name, tool.description, ...(tool.tags ?? [])].join(' ').toLowerCase()
      return haystack.includes(normalized)
    })
  }, [query, activeCategory, liveTools])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const activeCategoryDesc =
    activeCategory !== 'all' ? categories.find((c) => c.id === activeCategory)?.description : null

  const showRecent =
    recentTools.length > 0 && !query && activeCategory === 'all'

  return (
    <>
      <section className="hero-gradient glow-brand relative overflow-hidden border-b border-app">
        <PageContainer size="xl" className="relative py-12 sm:py-16">
          <p className="text-sm font-medium tracking-wide text-brand">{SITE_NAME}</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {SITE_TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            按任务分类，搜索或点选即可使用。
          </p>
          <div className="mt-8 max-w-xl">
            <label htmlFor="home-search" className="sr-only">
              搜索工具
            </label>
            <SearchInput
              id="home-search"
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索工具名称、用途或标签…"
              onShortcutHint={!query}
            />
          </div>
          <p className="mt-3 text-xs text-subtle">
            已收录 {liveTools.length} 个工具 · 按 <kbd className="rounded border border-app px-1">/</kbd>{' '}
            聚焦搜索
          </p>
        </PageContainer>
      </section>

      {showRecent && (
        <PageContainer size="xl" className="pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">最近使用</h2>
              <p className="mt-1 text-sm text-muted">快速回到上次打开的工具</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} compact />
            ))}
          </div>
        </PageContainer>
      )}

      <PageContainer size="xl" className="pb-12 pt-10">
        <section id="tools">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {activeCategory === 'all' ? '全部工具' : getCategoryName(activeCategory)}
              </h2>
              {activeCategoryDesc ? (
                <p className="mt-1 text-sm text-muted">{activeCategoryDesc}</p>
              ) : (
                <p className="mt-1 text-sm text-muted">按分类浏览，或搜索直达</p>
              )}
            </div>
            {query && (
              <Link to="/" className="text-sm text-brand hover:underline" onClick={() => setQuery('')}>
                清除搜索
              </Link>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="工具分类">
            <Chip selected={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
              全部
            </Chip>
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                selected={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </Chip>
            ))}
          </div>

          <div className="mt-6">
            {gridTools.length === 0 ? (
              <EmptyState
                title="没有找到匹配的工具"
                description="试试换个关键词，或选择「全部」分类"
              />
            ) : (
              <ToolGrid tools={gridTools} />
            )}
          </div>
        </section>
      </PageContainer>
    </>
  )
}
