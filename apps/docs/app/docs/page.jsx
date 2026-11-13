import { MarkdownPage } from '../../components/MarkdownPage.jsx'
import { getDocument } from '../../lib/docs.mjs'

export async function generateMetadata() {
  const document = await getDocument('/docs')
  return document ? { title: `${document.title} · Canon` } : {}
}

export default async function DocsPage() {
  return <MarkdownPage document={await getDocument('/docs')} />
}
