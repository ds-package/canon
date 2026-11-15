'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { getNavigationMode } from '../lib/navigation.mjs'

export function DocsAreaNavigation({ navigation }) {
  const pathname = usePathname()
  const mode = getNavigationMode(navigation, pathname)
  const currentRoute = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname

  return (
    <nav className="topnav" aria-label="Primary navigation">
      <Link
        aria-current={currentRoute === '/docs' ? 'page' : undefined}
        data-active={mode === 'docs' ? 'true' : undefined}
        href="/docs"
      >
        Docs
      </Link>
      <Link
        aria-current={currentRoute === '/docs/components' ? 'page' : undefined}
        data-active={mode === 'components' ? 'true' : undefined}
        href="/docs/components"
      >
        Components
      </Link>
    </nav>
  )
}
