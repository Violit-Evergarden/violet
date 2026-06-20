import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './Layout'
import { BlogPlaceholderPage } from '../pages/BlogPlaceholderPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'

const toolRoutes = [
  { path: 'tools/video-transcript', module: () => import('../tools/video-transcript') },
  { path: 'tools/audio-transcript', module: () => import('../tools/audio-transcript') },
  { path: 'tools/json-formatter', module: () => import('../tools/json-formatter') },
  { path: 'tools/text-diff', module: () => import('../tools/text-diff') },
  { path: 'tools/url-codec', module: () => import('../tools/url-codec') },
  { path: 'tools/markdown-preview', module: () => import('../tools/markdown-preview') },
  { path: 'tools/qr-code', module: () => import('../tools/qr-code') },
  { path: 'tools/image-compress', module: () => import('../tools/image-compress') },
  { path: 'tools/timestamp', module: () => import('../tools/timestamp') },
  { path: 'tools/base64', module: () => import('../tools/base64') },
] as const

function ToolSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24 text-sm text-muted">
          加载工具中...
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      ...toolRoutes.map(({ path, module }) => {
        const Tool = lazy(module)
        return {
          path,
          element: (
            <ToolSuspense>
              <Tool />
            </ToolSuspense>
          ),
        }
      }),
      { path: 'blog', element: <BlogPlaceholderPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
