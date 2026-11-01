import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { toWebHref } from '../lib/docs.mjs'

export function MarkdownPage({ document }) {
  return (
    <article className="markdown">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href = '', children }) => {
            const target = toWebHref(href, document.sourcePath)
            return target.startsWith('/') ? <Link href={target}>{children}</Link> : <a href={target}>{children}</a>
          },
        }}
      >
        {document.markdown}
      </Markdown>
    </article>
  )
}
