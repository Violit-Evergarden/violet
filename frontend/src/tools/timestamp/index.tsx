import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { getToolById } from '../../catalog/tools'
import { ToolLayout } from '../../components/layout/ToolPageShell'
import { usePageMeta } from '../../hooks/usePageMeta'
import { recordToolVisit } from '../../hooks/useRecentTools'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { Input } from '../../ui/Input'
import { Tabs } from '../../ui/Tabs'

const tool = getToolById('timestamp')!

type Unit = 'seconds' | 'milliseconds'

function parseUnixInput(value: string, unit: Unit): Date | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const num = Number(trimmed)
  if (!Number.isFinite(num)) return null
  const date = new Date(unit === 'seconds' ? num * 1000 : num)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatOutputs(date: Date) {
  const seconds = Math.floor(date.getTime() / 1000)
  return {
    unixSeconds: String(seconds),
    unixMilliseconds: String(date.getTime()),
    iso: date.toISOString(),
    local: date.toLocaleString('zh-CN', { hour12: false }),
    utc: date.toUTCString(),
  }
}

export default function TimestampTool() {
  usePageMeta(tool.name, tool.description)
  useEffect(() => {
    recordToolVisit(tool.id)
  }, [])

  const [mode, setMode] = useState<'unix' | 'datetime'>('unix')
  const [unit, setUnit] = useState<Unit>('seconds')
  const [unixInput, setUnixInput] = useState('')
  const [dateInput, setDateInput] = useState('')

  const { outputs, error } = useMemo(() => {
    if (mode === 'unix') {
      const date = parseUnixInput(unixInput, unit)
      if (!unixInput.trim()) return { outputs: null, error: '' }
      if (!date) return { outputs: null, error: '请输入有效的 Unix 时间戳' }
      return { outputs: formatOutputs(date), error: '' }
    }
    if (!dateInput.trim()) return { outputs: null, error: '' }
    const date = new Date(dateInput)
    if (Number.isNaN(date.getTime())) return { outputs: null, error: '请输入有效的日期时间' }
    return { outputs: formatOutputs(date), error: '' }
  }, [mode, unit, unixInput, dateInput])

  const toolbar = (
    <>
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { value: 'unix', label: 'Unix → 日期' },
          { value: 'datetime', label: '日期 → Unix' },
        ]}
      />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          const now = new Date()
          if (mode === 'unix') {
            setUnixInput(unit === 'seconds' ? String(Math.floor(now.getTime() / 1000)) : String(now.getTime()))
          } else {
            setDateInput(now.toISOString().slice(0, 16))
          }
        }}
      >
        现在
      </Button>
    </>
  )

  return (
    <ToolLayout title={tool.name} toolbar={toolbar}>
      <Card padding="md" className="space-y-4">
        {mode === 'unix' ? (
          <>
            <Tabs
              value={unit}
              onChange={setUnit}
              options={[
                { value: 'seconds', label: '秒' },
                { value: 'milliseconds', label: '毫秒' },
              ]}
            />
            <Input
              value={unixInput}
              onChange={(e) => setUnixInput(e.target.value)}
              placeholder="1718860800"
              invalid={Boolean(error)}
            />
          </>
        ) : (
          <Input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            invalid={Boolean(error)}
          />
        )}
        {error && <Alert variant="error">{error}</Alert>}
        {outputs && (
          <dl className="space-y-2 border-t border-app pt-4 text-sm">
            {[
              ['Unix（秒）', outputs.unixSeconds],
              ['Unix（毫秒）', outputs.unixMilliseconds],
              ['ISO 8601', outputs.iso],
              ['本地', outputs.local],
              ['UTC', outputs.utc],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <dt className="text-muted">{label}</dt>
                <dd className="flex items-center gap-2">
                  <code className="max-w-[14rem] truncate rounded bg-[var(--color-border-subtle)] px-2 py-0.5 text-xs sm:max-w-none">
                    {value}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!px-2"
                    onClick={async () => {
                      await navigator.clipboard.writeText(value)
                      toast.success('已复制')
                    }}
                  >
                    复制
                  </Button>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Card>
    </ToolLayout>
  )
}
