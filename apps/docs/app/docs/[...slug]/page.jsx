import { notFound } from 'next/navigation'

import { ButtonPlayground } from '../../../components/ButtonPlayground.jsx'
import { CheckboxPlayground } from '../../../components/CheckboxPlayground.jsx'
import { MarkdownPage } from '../../../components/MarkdownPage.jsx'
import { DialogPlayground } from '../../../components/DialogPlayground.jsx'
import { RadioGroupPlayground } from '../../../components/RadioGroupPlayground.jsx'
import { SelectPlayground } from '../../../components/SelectPlayground.jsx'
import { SwitchPlayground } from '../../../components/SwitchPlayground.jsx'
import { TextFieldPlayground } from '../../../components/TextFieldPlayground.jsx'
import { TextAreaPlayground } from '../../../components/TextAreaPlayground.jsx'
import { getDocument, getDocuments } from '../../../lib/docs.mjs'

const playgrounds = {
  '/docs/button': ButtonPlayground,
  '/docs/checkbox': CheckboxPlayground,
  '/docs/dialog': DialogPlayground,
  '/docs/radio-group': RadioGroupPlayground,
  '/docs/select': SelectPlayground,
  '/docs/switch': SwitchPlayground,
  '/docs/text-field': TextFieldPlayground,
  '/docs/text-area': TextAreaPlayground,
}

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
  const Playground = playgrounds[document.route]
  return (
    <>
      <MarkdownPage document={document} />
      {Playground && <Playground />}
    </>
  )
}
