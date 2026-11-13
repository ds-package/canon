'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { searchDocuments } from '../lib/search.mjs'

export function Search({ documents }) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchDocuments(documents, query), [documents, query])

  return (
    <div className="search">
      <label className="sr-only" htmlFor="docs-search">문서 검색</label>
      <input
        id="docs-search"
        type="search"
        placeholder="문서 검색"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {query && (
        <div className="search-results">
          {results.length ? results.map((document) => (
            <Link key={document.route} href={document.route} onClick={() => setQuery('')}>
              {document.title}
            </Link>
          )) : <span>검색 결과가 없습니다.</span>}
        </div>
      )}
    </div>
  )
}
