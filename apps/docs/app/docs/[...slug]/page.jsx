import { notFound } from 'next/navigation'

import { MarkdownPage } from '../../../components/MarkdownPage.jsx'
import { getDocument, getDocuments } from '../../../lib/docs.mjs'

export const dynamicParams = false

export async function generateStaticParams() {
  return (await getDocuments())
    .filter((document) => document.route.startsWith('/docs/'))
    .map((document) => ({ slug: document.route.replace(/^\/docs\/?/, '').split('/').filter(Boolean) }))
}

export async function generateMetadata({ params }) {
  const { slug = [] } = await params
  const document = await getDocument(`/docs${slug.length ? `/${slug.join('/')}` : ''}`)
  return document ? { title: `${document.title} · Canon` } : {}
}

export default async function DocumentPage({ params }) {
  const { slug = [] } = await params
  const document = await getDocument(`/docs${slug.length ? `/${slug.join('/')}` : ''}`)
  if (!document) notFound()
  return <MarkdownPage document={document} />
}
