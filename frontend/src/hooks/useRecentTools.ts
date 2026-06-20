import { useMemo, useSyncExternalStore } from 'react'
import { getToolById, getInternalTools, type ToolDefinition } from '../catalog/tools'

const STORAGE_KEY = 'jiban-recent-tools'
const MAX_RECENT = 6
const EMPTY_SNAPSHOT = '[]'

function parseRecentIds(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

function readRecentIds(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  return parseRecentIds(raw ?? EMPTY_SNAPSHOT)
}

function getSnapshot(): string {
  return localStorage.getItem(STORAGE_KEY) ?? EMPTY_SNAPSHOT
}

function writeRecentIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

let listeners: Array<() => void> = []

function subscribe(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function emit() {
  listeners.forEach((l) => l())
}

export function recordToolVisit(toolId: string) {
  const ids = readRecentIds().filter((id) => id !== toolId)
  writeRecentIds([toolId, ...ids].slice(0, MAX_RECENT))
  emit()
}

export function useRecentTools() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_SNAPSHOT)

  return useMemo((): ToolDefinition[] => {
    const ids = parseRecentIds(raw)
    const liveIds = new Set(getInternalTools().map((t) => t.id))
    return ids
      .filter((id) => liveIds.has(id))
      .map((id) => getToolById(id))
      .filter((tool): tool is ToolDefinition => Boolean(tool))
  }, [raw])
}
