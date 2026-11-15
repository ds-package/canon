import Link from 'next/link'

import { groupNavigationDocuments } from '../lib/navigation.mjs'
import { DocsAreaNavigation } from './DocsAreaNavigation.jsx'
import { Search } from './Search.jsx'
import { SidebarNavigation } from './SidebarNavigation.jsx'

export function DocsShell({ children, documents }) {
  const navigation = groupNavigationDocuments(documents)

  return (
    <div className="docs-shell">
      <header className="topbar">
        <Link className="brand" href="/">Canon</Link>
        <DocsAreaNavigation navigation={navigation} />
        <Search documents={documents} />
        <a href="https://github.com/ds-package/canon">GitHub</a>
      </header>
      <SidebarNavigation navigation={navigation} />
      <main className="content">{children}</main>
    </div>
  )
}
