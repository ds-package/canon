'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { getNavigationSections } from '../lib/navigation.mjs'

function normalizeRoute(route) {
  return route.length > 1 ? route.replace(/\/$/, '') : route
}

function NavigationSections({ pathname, sections }) {
  return sections.map((section) => (
    <section className="sidebar-section" key={section.key}>
      <h2>{section.title}</h2>
      <div className="sidebar-links">
        {section.documents.map((document) => {
          const label = document.route === '/docs/components' ? 'Overview' : document.title
          const isCurrent = normalizeRoute(pathname) === document.route
          return (
            <Link aria-current={isCurrent ? 'page' : undefined} key={document.route} href={document.route}>
              {label}
            </Link>
          )
        })}
      </div>
    </section>
  ))
}

export function SidebarNavigation({ navigation }) {
  const pathname = usePathname()
  const sections = getNavigationSections(navigation, pathname)
  const label = sections[0]?.key === 'components' ? 'Components' : 'Documentation'

  return (
    <>
      <aside className="sidebar" aria-label={`${label} navigation`}>
        <nav aria-label={`${label} navigation`}>
          <NavigationSections pathname={pathname} sections={sections} />
        </nav>
      </aside>
      <details className="mobile-navigation" key={pathname}>
        <summary>{label}</summary>
        <nav aria-label={`${label} navigation`}>
          <NavigationSections pathname={pathname} sections={sections} />
        </nav>
      </details>
    </>
  )
}
