import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './Layout'
import { BlogPlaceholderPage } from '../pages/BlogPlaceholderPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'

const VideoTranscriptTool = lazy(() => import('../tools/video-transcript'))
const JsonFormatterTool = lazy(() => import('../tools/json-formatter'))

function ToolSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24 text-sm text-slate-400">
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
      {
        path: 'tools/video-transcript',
        element: (
          <ToolSuspense>
            <VideoTranscriptTool />
          </ToolSuspense>
        ),
      },
      {
        path: 'tools/json-formatter',
        element: (
          <ToolSuspense>
            <JsonFormatterTool />
          </ToolSuspense>
        ),
      },
      { path: 'blog', element: <BlogPlaceholderPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
