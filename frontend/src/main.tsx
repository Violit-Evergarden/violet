import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { ThemeProvider } from './app/ThemeProvider'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: 'bg-surface text-[var(--color-text)] border border-app shadow-lg',
        }}
      />
    </ThemeProvider>
  </StrictMode>,
)
