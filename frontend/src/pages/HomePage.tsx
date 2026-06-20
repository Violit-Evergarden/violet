import { useMemo, useState } from 'react'
import { categories } from '../catalog/categories'
import { tools } from '../catalog/tools'
import { ToolGrid } from '../components/ToolGrid'
import { Badge } from '../ui/Badge'

export function HomePage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredTools = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return tools.filter((tool) => {
      const matchCategory = activeCategory === 'all' || tool.category === activeCategory
      if (!matchCategory) return false
      if (!normalized) return true
      const haystack = [tool.name, tool.description, ...(tool.tags ?? [])].join(' ').toLowerCase()
      return haystack.includes(normalized)
    })
  }, [query, activeCategory])

  const featuredTools = useMemo(() => tools.filter((t) => t.featured), [])

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <section className="space-y-4">
        <Badge variant="sky">Violet37 工具箱</Badge>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">实用在线工具集合</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-400">
          自研工具与精选外链一站汇总。每个工具独立页面，按需使用；更多能力持续增加中。
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索工具名称、描述或标签..."
          className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
        />
      </section>

      {!query && activeCategory === 'all' && featuredTools.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">推荐工具</h2>
          <ToolGrid tools={featuredTools} />
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              activeCategory === 'all'
                ? 'bg-sky-500 text-white'
                : 'border border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                activeCategory === cat.id
                  ? 'bg-sky-500 text-white'
                  : 'border border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <ToolGrid tools={filteredTools} />
      </section>
    </div>
  )
}
