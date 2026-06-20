import { Link } from 'react-router-dom'
import { getInternalTools } from '../../catalog/tools'
import { SITE_DOMAIN, SITE_NAME, SITE_TAGLINE } from '../../config/site'

export function SiteFooter() {
  const internalTools = getInternalTools()

  return (
    <footer className="mt-auto border-t border-app bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <p className="font-semibold text-[var(--color-text)]">{SITE_NAME}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{SITE_TAGLINE}</p>
          <p className="mt-3 text-xs text-subtle">
            <a
              href={`https://${SITE_DOMAIN}`}
              className="hover:text-brand transition"
              rel="noopener noreferrer"
            >
              {SITE_DOMAIN}
            </a>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">工具</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {internalTools.map((tool) => (
              <li key={tool.id}>
                <Link to={tool.path} className="text-sm text-muted hover:text-brand transition">
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-app py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-subtle sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_NAME} · {SITE_DOMAIN}
          </p>
          <a
            href="https://github.com/Violit-Evergarden/violet"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand transition"
          >
            GitHub
          </a>
        </div>
        <p className="mt-2 text-center text-xs text-subtle">备案号：待 ICP 同步后填写</p>
      </div>
    </footer>
  )
}
