import './globals.css'

import { DocsShell } from '../components/DocsShell.jsx'
import { getDocumentIndex } from '../lib/docs.mjs'

export const metadata = {
  title: 'Canon',
  description: '사람과 agent를 위한 Canon 디자인 시스템 문서',
}

export default async function RootLayout({ children }) {
  const documents = await getDocumentIndex()
  return (
    <html lang="ko">
      <body><DocsShell documents={documents}>{children}</DocsShell></body>
    </html>
  )
}
