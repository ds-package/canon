const sectionDefinitions = [
  ['getting-started', 'Getting started'],
  ['foundation', 'Foundations'],
  ['architecture', 'Architecture'],
]

function byNavigationOrder(left, right) {
  return (left.navigationOrder ?? Number.MAX_SAFE_INTEGER) - (right.navigationOrder ?? Number.MAX_SAFE_INTEGER)
    || left.title.localeCompare(right.title)
}

export function groupNavigationDocuments(documents) {
  const components = documents.filter((document) => document.navigation === 'component')
  const sections = sectionDefinitions.map(([key, title]) => ({
    key,
    title,
    documents: documents.filter((document) => document.navigation === key).sort(byNavigationOrder),
  }))
  const overviewIndex = components.findIndex((document) => document.route === '/docs/components')
  if (overviewIndex > 0) components.unshift(components.splice(overviewIndex, 1)[0])
  return { components, sections }
}

export function getNavigationMode(navigation, route) {
  const normalizedRoute = typeof route === 'string' && route.length > 1 ? route.replace(/\/$/, '') : route
  if (normalizedRoute === '/') return 'home'
  return navigation.components.some((document) => document.route === normalizedRoute) ? 'components' : 'docs'
}

export function getNavigationSections(navigation, route) {
  return getNavigationMode(navigation, route) === 'components'
    ? [{ key: 'components', title: 'Components', documents: navigation.components }]
    : navigation.sections
}
