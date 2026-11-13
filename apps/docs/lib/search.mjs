const normalize = (value) => value.toLocaleLowerCase('ko').replace(/\s+/g, ' ').trim()

export function searchDocuments(documents, query, limit = 8) {
  const terms = normalize(query).split(' ').filter(Boolean)
  if (!terms.length) return []

  return documents
    .map((document) => {
      const title = normalize(document.title)
      const headings = normalize(document.headings.join(' '))
      const body = normalize(document.body)
      if (!terms.every((term) => title.includes(term) || headings.includes(term) || body.includes(term))) return null

      const score = terms.reduce(
        (total, term) => total + (title.includes(term) ? 3 : 0) + (headings.includes(term) ? 2 : 0) + (body.includes(term) ? 1 : 0),
        0,
      )
      return { document, score }
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.document.title.localeCompare(right.document.title, 'ko'))
    .slice(0, limit)
    .map(({ document }) => document)
}
