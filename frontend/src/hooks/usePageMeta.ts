import { useEffect } from 'react'
import { SITE_NAME } from '../config/site'

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`

    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    if (description && meta) {
      meta.setAttribute('content', description)
    }

    return () => {
      document.title = prevTitle
      if (meta && description) meta.setAttribute('content', prevDesc)
    }
  }, [title, description])
}
