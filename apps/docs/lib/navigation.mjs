export function groupNavigationDocuments(documents) {
  const groups = documents.reduce((result, document) => {
    result[document.navigation === 'component' ? 'components' : 'documents'].push(document)
    return result
  }, { documents: [], components: [] })
  const overviewIndex = groups.components.findIndex((document) => document.route === '/docs/components')
  if (overviewIndex > 0) groups.components.unshift(groups.components.splice(overviewIndex, 1)[0])
  return groups
}
