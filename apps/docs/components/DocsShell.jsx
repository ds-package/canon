import Link from 'next/link'

import { groupNavigationDocuments } from '../lib/navigation.mjs'
import { Search } from './Search.jsx'

export function DocsShell({ children, documents }) {
  const navigation = groupNavigationDocuments(
    documents.filter((document) => document.route !== '/docs/references'),
  )

  return (
    <div className="docs-shell">
      <header className="topbar">
        <Link className="brand" href="/">Canon</Link>
        <Search documents={documents} />
        <a href="https://github.com/ds-package/canon">GitHub</a>
      </header>
      <aside className="sidebar" aria-label="문서 탐색">
        <nav>
          {navigation.documents.map((document) => (
            <Link key={document.route} href={document.route}>{document.title}</Link>
          ))}
          <details open>
            <summary>Components</summary>
            <div className="sidebar-submenu">
              {navigation.components.map((document) => (
                <Link key={document.route} href={document.route}>
                  {document.route === '/docs/components' ? 'Overview' : document.title}
                </Link>
              ))}
            </div>
          </details>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  )
}
