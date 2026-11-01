import Link from 'next/link'

import { Search } from './Search.jsx'

export function DocsShell({ children, documents }) {
  return (
    <div className="docs-shell">
      <header className="topbar">
        <Link className="brand" href="/">Canon</Link>
        <Search documents={documents} />
        <a href="https://github.com/ds-package/canon">GitHub</a>
      </header>
      <aside className="sidebar" aria-label="문서 탐색">
        <nav>
          {documents.map((document) => (
            <Link key={document.route} href={document.route}>{document.title}</Link>
          ))}
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  )
}
