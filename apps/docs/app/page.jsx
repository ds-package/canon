import { MarkdownPage } from '../components/MarkdownPage.jsx'
import { getDocument } from '../lib/docs.mjs'

export default async function HomePage() {
  return <MarkdownPage document={await getDocument('/')} />
}
